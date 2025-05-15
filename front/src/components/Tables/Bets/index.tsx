/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../../hooks/contexts/UserContext";
import { api } from "../../../service/api";
import chevronSVG from "../../../assets/img/chevron-down.svg";
import dayjs from "dayjs";

export function TableBets() {
  const { toggleLoading } = useContext(UserContext)
  const [cash, setCash] = useState<any>([])
  const [page, setPage] = useState(1)
  const [disable, setDisable] = useState(false)

  async function handlePagination() {
    toggleLoading(true)
    try {
      const response = await api.post("/cash/pagination", {page})
      if (response.data.length > 0 && page == 1) {
        setCash(response.data)
        setDisable(false)
      } else if (response.data.length > 0 && page > 1) {
        setCash([...cash, ...response.data])
        setDisable(false)
      } else {
        setDisable(true)
      }
      if (response.data.length < 25) {
        setDisable(true)
      }
    } catch(err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
    toggleLoading(false)
  }

  useEffect(() => {
    handlePagination()
  }, [page])


  return(
    <>
      <div className="table-c">
          <h2 className="title">EXTRATO LANCES</h2>
          <table className="tbl">
            <thead>
              <tr>
                <th className="tx-l">ID</th>
                <th className="tx-c">Data</th>
                <th className="tx-l">Operação</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th className="tx-r">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {
                cash && cash.map((c: any) => (
                  <tr>
                    <td className="tx-l">{c?.id}</td>
                    <td className="tx-c">{c?.date && dayjs(c?.date).format("DD-MM-YYYY HH:mm")}</td>
                    <td>{c?.opData?.name}</td>
                    <td>$ {Number(c?.amount || 0).toFixed(2)}</td>
                    <td>{c?.type == "c" ? "CRÉDITO" : "DÉBITO"}</td>
                    <td className="tx-r">$ {Number(c?.balance || 0).toFixed(2)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          {
            !disable &&
            <div className="loader-s-c">
              <a onClick={() => setPage(page + 1)} className="loader">
                <img src={chevronSVG} alt="" />
                <span>MAIS</span>
              </a>
            </div>
          }
        </div>
    </>
  )
}