import "./promocodes.css"
import SearchBar from "../../components/SearchBar"
import Table from "../../components/Table"
import Button from "../../components/Button"
import Input from "../../components/Input"
import MessageBox from "../../components/MessageBox"
import ProfileImage from "../../components/ProfileImage"
import useFetch from "../../hooks/useFetch"
import api from "../../utils/api"
import { useRef, useState } from "react"
import { useAuth } from "../../contexts/AuthProvider"

import "./promocodes.css"

const { REACT_APP_API_URL } = process.env

function PromoCodeRow({ row, index }) {
  const { token } = useAuth()
  const [isEditting, setIsEditting] = useState(false)
  const codeRef = useRef()
  const validUntilRef = useRef()
  const discountRef = useRef()

  const upsertCode = async (evt, method) => {
    evt.preventDefault()
    const response = await api[method](
      "/api/promo" + (method == "put" ? `/${row.code}` : ""),
      {
        promocode: codeRef.current.value,
        validuntil: validUntilRef.current.value,
        discount: discountRef.current.value,
      },
      token,
    )
    const result = await response.json()

    if (response.ok) {
      row.setRefreshList(!row.refreshList)
    } else {
      row.setIsError(true)
      row.setMessage(result.body || response.statusText)
    }
    setIsEditting(false)
  }

  const deleteCode = async (evt) => {
    evt.preventDefault()
    const response = await api.delete(`/api/promo/${row.code}`, {}, token)
    const result = await response.json()

    if (response.ok) {
      row.setRefreshList(!row.refreshList)
    } else {
      row.setIsError(true)
      row.setMessage(result.body || response.statusText)
    }
  }

  return row.code !== undefined && !isEditting ? (
    <tr key={index}>
      <td>{row.code}</td>
      <td>{row.validUntil.split("T")[0]}</td>
      <td>{row.discount}</td>
      <td>
        {row.createdFor ? (
          <ProfileImage username={row.createdFor.username} size={30} />
        ) : (
          ""
        )}
      </td>
      <td>
        <Button onClick={() => setIsEditting(true)}>Edit</Button>
        <Button kind="danger" onClick={deleteCode}>
          Delete
        </Button>
      </td>
    </tr>
  ) : (
    <tr key={index}>
      <td>
        <Input
          placeholder="Promotion code"
          defaultValue={row.code}
          ref={codeRef}
          required
        />
      </td>
      <td>
        <Input
          type="date"
          placeholder="Valid until"
          defaultValue={row.validUntil?.split("T")?.[0]}
          ref={validUntilRef}
          required
        />
      </td>
      <td>
        <Input
          type="number"
          placeholder="Discount"
          defaultValue={row.discount}
          ref={discountRef}
          required
        />
      </td>
      <td></td>
      <td>
        {isEditting ? (
          <>
            <Button kind="primary" onClick={(evt) => upsertCode(evt, "put")}>
              Done
            </Button>
            <Button kind="secondary" onClick={() => setIsEditting(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button kind="primary" onClick={(evt) => upsertCode(evt, "post")}>
            Add code
          </Button>
        )}
      </td>
    </tr>
  )
}

export default function PromoCodes() {
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState(null)
  const [refreshList, setRefreshList] = useState(false)
  const [codes] = useFetch(
    `${REACT_APP_API_URL}/api/promo`,
    { body: [] },
    refreshList,
  )

  return (
    <>
      <MessageBox isError={isError} message={message} setMessage={setMessage} />
      <div className="content">
        <h1>Promotion codes</h1>
        <div className="promocodes-actions">
          <SearchBar placeholder={"Promocodes"} />
        </div>
        <div className="promocodes-table">
          <Table
            headers={[
              "Promocode",
              "Valid until",
              "Discount",
              "Created for",
              "",
            ]}
            rows={[{}, ...(codes?.body || [])].map((code) => ({
              code: code.promocode,
              validUntil: code.validuntil,
              discount: code.discount,
              createdFor: code.createdFor,
              isError,
              setIsError,
              setMessage,
              refreshList,
              setRefreshList,
            }))}
            renderRowWith={PromoCodeRow}
          />
        </div>
      </div>
    </>
  )
}
