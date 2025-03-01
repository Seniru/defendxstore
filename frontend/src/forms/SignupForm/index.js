import BasicInformationForm from "./BasicInformationForm"
import BillingInformationForm from "./BillingInformationForm"
import ProfileImageForm from "./ProfileImageForm"
import "./SignupForm.css"
import { PaginationProvider } from "../../contexts/PaginationProvider"
import { useState } from "react"
import Pager from "../../components/Pager"

export default function SignupForm({ className }) {
  let [paginationInformation, setPaginationInformation] = useState({})
  let [data, setData] = useState({})
  let [errors, setErrors] = useState(null)

  return (
    <div className={`signup-container container ${className}`}>
      <h1>Sign up</h1>
      <p className="secondary-text">
        Step {paginationInformation.page + 1} of{" "}
        {paginationInformation.pageCount}
      </p>
      <Pager
        color="var(--primary-color)"
        page={paginationInformation.page}
        pageCount={paginationInformation.pageCount}
      />
      <PaginationProvider setPaginationInformation={setPaginationInformation}>
        <BasicInformationForm
          data={data}
          setData={setData}
          errors={errors}
          setErrors={setErrors}
        />
        <BillingInformationForm
          data={data}
          setData={setData}
          errors={errors}
          setErrors={setErrors}
        />
        <ProfileImageForm
          data={data}
          setData={setData}
          errors={errors}
          setErrors={setErrors}
        />
      </PaginationProvider>
    </div>
  )
}
