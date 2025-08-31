import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function RequirementsField({
  name,
  label,
  register,
  setValue,
  errors,
  getValues,
}) {
  const { editCourse, course } = useSelector((state) => state.course)

  // A.1 add karva mate chhe
  const [requirement, setRequirement] = useState("")

  //B.1 niche je list create thay che te fiels chhe 
  const [requirementsList, setRequirementsList] = useState([])


  //A.2 add button login
  const handleAddRequirement = () => {
    // requirement field ma kasu aavyu chhe k nai 
    if (requirement) {
      // aavyu hoy to tene previous list ma add kari devanu 
      setRequirementsList([...requirementsList, requirement])
      // and current field ne empty mark karvanu
      setRequirement("")
    }
  }

  //B.2 remove button logic 
  const handleRemoveRequirement = (index) => {
    // aakhi list ne ek variable me lai lidhi
    const updatedRequirements = [...requirementsList]
    // splice method no use kari ne te field mathi remove kari didhi 
    updatedRequirements.splice(index, 1)
    // remove thaya pachi je updated list rahi tene set kari
    setRequirementsList(updatedRequirements)
  }

  useEffect(() => {
    if (editCourse) {
      setRequirementsList(course?.instructions)
    }
    
    register(name, { required: true, validate: (value) => value.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // jyare jyare aa requirementList update thase tyare setValue karishu name ni under requirementList.
  useEffect(() => {
    setValue(name, requirementsList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirementsList])


  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="form-style w-full"
        />
        {/* A.3 */}
        <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>
      {requirementsList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {requirementsList.map((requirement, index) => (
            <li key={index} className="flex items-center text-richblack-5">
              <span>{requirement}</span>
              {/* B.3 */}
              <button
                type="button"
                className="ml-2 text-xs text-pure-greys-300 "
                onClick={() => handleRemoveRequirement(index)}
              >
                clear
              </button>
            </li>
          ))}
        </ul>
      )}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}