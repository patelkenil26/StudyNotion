import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../../common/IconBtn";
import { resetCourseState, setCourse, setStep } from "../../../../../slices/courseSlice";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { Navigate } from "react-router-dom";

const PublishCourse = () => {
  const { register, setValue, getValues, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  const goToCourses = () => {
    dispatch(resetCourseState())
    Navigate("/dashboard/my-courses")
  }

  const handleCoursePublish = async () => {
    // check if form has been updated or not
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      // form has not been updated
      // no need to make api call
      goToCourses()
      return
    }
    const formData = new FormData()
    formData.append("courseId", course._id)
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT
    formData.append("status", courseStatus)
    setLoading(true)
    const result = await editCourseDetails(formData, token)
    if (result) {
      goToCourses()
    }
    setLoading(false)
  }
  const onSubmit = (data) => {
    handleCoursePublish();
  };

  const goBack = () => {
    dispatch(setStep(2));
  };

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Publish Course</p>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this course as public
            </span>
          </label>
        </div>

        {/* Next Previous button */}
        <div className="flex items-center gap-x-4 max-w-max ml-auto ">
          <button
            disabled={loading}
            onClick={goBack}
            type="button"
            className="bg-richblack-300 text-richblack-700 rounded-md p-2 flex cursor-pointer items-center gap-x-2 font-semibold px-[20px] py-[8px]"
          >
            Back
          </button>

          <IconBtn text="Save Changes" disabled={loading} />
        </div>
      </form>
    </div>
  );
};

export default PublishCourse;
