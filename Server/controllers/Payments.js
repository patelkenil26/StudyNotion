const { createStripeSession } = require("../config/stripe");
const User = require("../models/User");
const Course = require("../models/Course");
const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");
const { default: Stripe } = require("stripe");
const CourseProgress = require("../models/CourseProgress");

// Create Stripe payment session
exports.createStripePaymentSession = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  console.log("payment page course details: ", courses)
  console.log("user id on payment page: ",userId)
  if (!courses.length) {
    return res
      .status(400)
      .json({ success: false, message: "No courses provided." });
  }

  let totalAmount = 0;

  try {
    for (const courseId of courses) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found." });
      }

      // const user = await User.findById(userId);
      // if (user.courses.includes(courseId)) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: 'User already enrolled in the course.' });
      // }

      // const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(userId)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "User already enrolled in the course.",
          });
      }

      // Call enrollStudents function after payment success
      await enrollStudents(courses, userId, res);

      totalAmount += course.price;
    }

    const session = await createStripeSession(
      totalAmount,
      "inr",
      req.user.email
    );

    return res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Handle Stripe Webhook for Payment Success
exports.handleStripeWebhook = async (req, res) => {
  const userId = req.user.id;
  const session = req.body.data.object;

  // Fetch user details from Stripe session or your database (e.g., by session customer email)
  const userEmail = session.customer_email;
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return res.status(400).json({ success: false, message: "User not found." });
  }

  // Get the list of courses in the session (you may need to fetch it based on session details)
  const courses = session.line_items.data.map((item) => item.price.product.id); // Example, update based on how you're storing product data

  let totalAmount = 0;

  // Calculate the total amount for the courses in the session
  for (const courseId of courses) {
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }
    totalAmount += course.price; // Add course price to totalAmount
  }

  // Send a success email with the total amount in INR (convert from paise/cents)
  try {
    await mailSender(
      user.email,
      "Payment Successful!",
      paymentSuccessEmail(user.firstName, totalAmount / 100, session.id) // Convert totalAmount to INR (divide by 100)
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error sending payment success email.",
      });
  }

  // Return the appropriate response to Stripe
  return res
    .status(200)
    .json({ success: true, message: "Payment successful, email sent." });
};

// const { instance } = require("../config/razorpay")
// const Course = require("../models/Course")
// const crypto = require("crypto")
// const User = require("../models/User")
// const mailSender = require("../utils/mailSender")
// const mongoose = require("mongoose")
// const {
//   courseEnrollmentEmail,
// } = require("../mail/templates/courseEnrollmentEmail")
// const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
// const CourseProgress = require("../models/CourseProgress")

// // Capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//   const { courses } = req.body
//   const userId = req.user.id
//   if (courses.length === 0) {
//     return res.json({ success: false, message: "Please Provide Course ID" })
//   }

//   let total_amount = 0

//   // console.log("UserId capture payment" , userId)
//   // console.log("capture payment All Courses" , courses)

//   for (const course_id of courses) {
//     let course
//     try {
//       // Find the course by its ID
//       course = await Course.findById(course_id)

//       // If the course is not found, return an error
//       if (!course) {
//         return res
//           .status(200)
//           .json({ success: false, message: "Could not find the Course" })
//       }

//       // Check if the user is already enrolled in the course
//       const uid = new mongoose.Types.ObjectId(userId)
//       if (course.studentsEnrolled.includes(uid)) {
//         return res
//           .status(200)
//           .json({ success: false, message: "Student is already Enrolled" })
//       }

//       // Add the price of the course to the total amount
//       total_amount += course.price
//     } catch (error) {
//       console.log(error)
//       return res.status(500).json({ success: false, message: error.message })
//     }
//   }

//   const currency = "INR";
//   const options = {
//     amount: total_amount * 100,
//     currency,
//     receipt: Math.random(Date.now()).toString(),
//   }

//   try {
//     // Initiate the payment using Razorpay
//     const paymentResponse = await instance.orders.create(options)
//     console.log(paymentResponse)
//     res.json({
//       success: true,
//       data: paymentResponse,
//     })
//   } catch (error) {
//     console.log(error)
//     res
//       .status(500)
//       .json({ success: false, message: "Could not initiate order." })
//   }
// }

// verify the payment
// exports.verifyPayment = async (req, res) => {
//   const razorpay_order_id = req.body?.razorpay_order_id
//   const razorpay_payment_id = req.body?.razorpay_payment_id
//   const razorpay_signature = req.body?.razorpay_signature
//   const courses = req.body?.courses

//   const userId = req.user.id

//   if (
//     !razorpay_order_id ||
//     !razorpay_payment_id ||
//     !razorpay_signature ||
//     !courses ||
//     !userId
//   ) {
//     return res.status(200).json({ success: false, message: "Payment Failed" })
//   }

//   let body = razorpay_order_id + "|" + razorpay_payment_id

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET)
//     .update(body.toString())
//     .digest("hex")

//   if (expectedSignature === razorpay_signature) {
//     await enrollStudents(courses, userId, res)
//     return res.status(200).json({ success: true, message: "Payment Verified" })
//   }

//   return res.status(200).json({ success: false, message: "Payment Failed" })
// }

// Send Payment Success Email
// exports.sendPaymentSuccessEmail = async (req, res) => {
//   const { orderId, paymentId, amount } = req.body

//   const userId = req.user.id

//   if (!orderId || !paymentId || !amount || !userId) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Please provide all the details" })
//   }

//   try {
//     const enrolledStudent = await User.findById(userId)

//     await mailSender(
//       enrolledStudent.email,
//       `Payment Received`,
//       paymentSuccessEmail(
//         `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
//         amount / 100,
//         orderId,
//         paymentId
//       )
//     )
//   } catch (error) {
//     console.log("error in sending mail", error)
//     return res
//       .status(400)
//       .json({ success: false, message: "Could not send email" })
//   }
// }

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  console.log("Courses on payment success when add ", courses);
  if (!courses || !userId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please Provide Course ID and User ID",
      });
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" });
      }
      console.log("Updated course: ", enrolledCourse);

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      console.log("Enrolled student: ", enrolledStudent);
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );

      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};

//capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {

//     // Important 2 steps in this controller
//     // Step 1 : razorpay no instance lavavno
//     // Step 2 : je instance aave tena par order create karvo

//     //get courseId and UserID
//     const {course_id} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseID
//     if(!course_id) {
//         return res.json({
//             success:false,
//             message:'Please provide valid course ID',
//         })
//     };
//     //valid courseDetail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course) {
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             });
//         }

//         //user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             return res.status(200).json({
//                 success:false,
//                 message:'Student is already enrolled',
//             });
//         }
//     }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }

//     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         });
//     }
//     catch(error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not initiate order",
//         });
//     }
// };

//verify Signature of Razorpay and Server

// exports.verifySignature = async (req, res) => {

//     // Important Steps in this controller
//     // Step1: webhook ma secret key nakhavi
//     // Step2: aa webhookScret ne A B C three step through hex(Secret key na form ma) ma convert karvi
//     // Step3: have aa webhookScret and razorpay jode je secret padi chhe te banne ne compare karva
//     // Step4: if same aave to j user ma course add karvo ane course ma user add karvo

//     // Step :  1
//     const webhookSecret = "12345678";

//     // Three Steps for convert the step1 into secret key
//     // A
//     const shasum =  crypto.createHmac("sha256", webhookSecret);
//     // B
//     shasum.update(JSON.stringify(req.body));
//     // C
//     const digest = shasum.digest("hex");

//     // Step : 2
//     const signature = req.headers["x-razorpay-signature"];

//     // Compare Step 1 and Step 2
//     if(signature === digest) {
//         console.log("Payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{
//                 //fulfil the action

//                 //find the course and enroll the student in it
//                 const enrolledCourse = await Course.findOneAndUpdate(
//                                                 {_id: courseId},
//                                                 {$push:{studentsEnrolled: userId}},
//                                                 {new:true},
//                 );

//                 if(!enrolledCourse) {
//                     return res.status(500).json({
//                         success:false,
//                         message:'Course not Found',
//                     });
//                 }

//                 console.log(enrolledCourse);

//                 //find the student and add the course to their list enrolled courses me
//                 const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id:userId},
//                                                 {$push:{courses:courseId}},
//                                                 {new:true},
//                 );

//                 console.log(enrolledStudent);

//                 //mail send krdo confirmation wala
//                 const emailResponse = await mailSender(
//                                         enrolledStudent.email,
//                                         "Congratulations from CodeHelp",
//                                         "Congratulations, you are onboarded into new CodeHelp Course",
//                 );

//                 console.log(emailResponse);
//                 return res.status(200).json({
//                     success:true,
//                     message:"Signature Verified and COurse Added",
//                 });

//         }
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else {
//         return res.status(400).json({
//             success:false,
//             message:'Invalid request',
//         });
//     }

// };
