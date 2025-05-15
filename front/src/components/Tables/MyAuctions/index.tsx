/* eslint-disable eqeqeq */
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
import utc from "dayjs/plugin/utc";
import { AiFillEdit, AiFillEye, AiOutlinePlus } from "react-icons/ai";
import { Modal } from "../../Modal";
import { useForm } from "react-hook-form";
import Select from 'react-select'
import { Input } from "../../Input";

dayjs.extend(utc)

const status: any = {
  "a": "ATIVO",
  "i": "INATIVO",
  "e": "ENCERRADO"
}
let timeOut: NodeJS.Timeout | null = null;

export function MyAuctions() {
  const { toggleLoading, loading, getBalance } = useContext(UserContext)
  const [cash, setCash] = useState<any>([])
  const [page, setPage] = useState(1)
  const [disable, setDisable] = useState(false)
  const [modal, setModal] = useState(false)
  const [modalAuction, setModalAuction] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [enableMark, setEnableMark] = useState(false)
  const [termsCheck, setTermsCheck] = useState(false)
  const [seeInfos, setSeeInfos] = useState(false)
  const [auctionInfoData, setAuctionInfoData] = useState<any>({})

  const { register, getValues, reset, setValue } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
	});

  async function handlePagination() {
    toggleLoading(true)
    try {
      const response = await api.post("/auctions/user/pagination", {page})
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

  async function searchProducts(search: string) {
    try {
      const response = await api.post("/products/user/search", {search: search, page: 1})
      if (response.data.length < 1) {
        setProducts([])
      }
      const list = []
      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        element.label = element.name;
        element.value = element.id;
        list.push(element)
      }
      setProducts(list)
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
  }

  async function handleCheckInfoBeforeCreateProduct(data: any) {
    if (!data || !data?.product || !data?.betsUse || 
        !data?.startDate || !data?.timer || 
        (data?.mark == true && !data?.markPercentage)
    ) {
      toast(`Alguns parametros não são validos revise os dados`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
      return;
    }
    data.startDate = dayjs(data.startDate).utc().format()
    toggleLoading(true)
    try {
      const response = await api.post("/auctions/user/info/info-create", data)
      setAuctionInfoData(response.data)
      setSeeInfos(true)
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
    toggleLoading(false)
  }
  async function handleGetInfoAuction(auction: number) {
    if (!auction)
    {
      toast(`Não foi possivel encontrar o leilão`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
      return;
    }
    toggleLoading(true)
    try {
      const response = await api.post("/auctions/user/info/info-check", {auction: auction})
      setAuctionInfoData(response.data)
      setModalAuction(true)
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
    toggleLoading(false)
  }
  async function handleCreateProduct(data: any) {
    if (!data || !data?.product || !data?.betsUse || 
        !data?.startDate || !data?.timer || 
        (data?.mark == true && !data?.markPercentage)
    ) {
      toast(`Alguns parametros não são validos revise os dados`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
      return;
    }
    data.startDate = dayjs(data.startDate).utc().format()
    toggleLoading(true)
    try {
      await api.post("/auctions/user/create", data)
      reset({})
			toast(`Leilão criado com sucesso`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
      setSeeInfos(false)
      setModal(false)
      setTermsCheck(false)
      getBalance();
    } catch (err: any) {
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
        <h2 className="title">MEUS LEILÕES</h2>
        <div className="filters">
          <form onSubmit={(e) => {
            e.preventDefault();
          }}>
            <div className="buttons-c">
              <a onClick={() => setModal(true)} className="button-txt-icon">
                <AiOutlinePlus size={24} color="#fff" />
                <p>CRIAR LEILÃO</p>
              </a>
            </div>
          </form>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th className="tx-l">ID</th>
              <th className="tx-c">Data de início</th>
              <th className="tx-l">Produto</th>
              <th>Lances usados</th>
              <th>Timer</th>
              <th>Data de fim</th>
              <th>Afiliação</th>
              <th>Porcentagem</th>
              <th>Vencedor</th>
              <th>Status</th>
              <th className="tx-l">Menu</th>
            </tr>
          </thead>
          <tbody>
            {
              cash && cash.map((c: any) => (
                <tr>
                  <td className="tx-l">{c?.id}</td>
                  <td className="tx-c">{c?.startDate && dayjs(c?.startDate).format("DD-MM-YYYY HH:mm")}</td>
                  <td>{c?.productData?.name}</td>
                  <td>{c?.betsUse}</td>
                  <td>{c?.timer}</td>
                  <td className="tx-c">{c?.endDate && dayjs(c?.endDate).format("DD-MM-YYYY HH:mm")}</td>
                  <td>{c?.mark === "y" ? status["a"] : status["i"]}</td>
                  <td>{c?.markPercentage} %</td>
                  <td>{c?.winnerData?.username}</td>
                  <td>{status[c?.status]}</td>
                  <td className="tx-r">
                    {/* { 
                      !c?.winner && c?.status == "a" && 
                      dayjs(c?.startDate).isAfter(dayjs()) &&
                      <a 
                        title="Editar leilão"
                        onClick={() => console.log(dayjs(c?.startDate).isAfter(dayjs()))} 
                        className="mini-bt-icon"
                      >
                        <AiFillEdit />
                      </a>
                    } */}
                    <a 
                      title="Informações"
                      onClick={() => handleGetInfoAuction(c?.id)} 
                      className="mini-bt-icon"
                    >
                      <AiFillEye />
                    </a>
                  </td>
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
      <Modal
				handler={modalAuction}
				onRequestClose={() => {
          setModalAuction(false)
        }}
				title={`LEILÃO ${auctionInfoData?.id}`}
			>
				<form 
					accept-charset="utf-8"
					onSubmit={(e) => {
						e.preventDefault()
            
					}}
				>
          <div className="info-box">
            <div className="line">
              <span className="title">Produto</span>
              <span className="desc">{String(auctionInfoData?.productName).length < 25 ? auctionInfoData?.productName : (String(auctionInfoData?.productName).substring(0, 23) + "...")}</span>
            </div>
            <div className="line">
              <span className="title">Valor do produto</span>
              <span className="desc">{auctionInfoData?.productPriceFormat}</span>
            </div>
            <div className="line">
              <span className="title">Data de início</span>
              <span className="desc">
                {auctionInfoData?.startDate &&
                  new Intl.DateTimeFormat("pt-br", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit" 
                  }).format(new Date(auctionInfoData?.startDate))
                }
              </span>
            </div>
            <div className="line">
              <span className="title">Lances descontados</span>
              <span className="desc">{auctionInfoData?.betsUse}</span>
            </div>
            <div className="line">
              <span className="title">Valor do timer</span>
              <span className="desc">{auctionInfoData?.timer}</span>
            </div>
            <div className="line">
              <span className="title">Indicações</span>
              <span className="desc">{auctionInfoData?.mark == true ? "HABILITADO" : "DESABILITADO"}</span>
            </div>
            <div className="line">
              <span className="title">% de ganho</span>
              <span className="desc">{auctionInfoData?.percentGainFormat}</span>
            </div>
            <div className="line">
              <span className="title">% dos corretores</span>
              <span className="desc">{auctionInfoData?.markPercentageFormat}</span>
            </div>
            <div className="line">
              <span className="title">% da plataforma</span>
              <span className="desc">{auctionInfoData?.platformBetPercentFormat}</span>
            </div>
            <div className="line">
              <span className="title">Taxa de compra</span>
              <span className="desc">{auctionInfoData?.platformBuyPercentFormat}</span>
            </div>
            <div className="line">
              <span className="title">Valor atual do leilão</span>
              <span className="desc">{
                new Intl.NumberFormat("en-us", {
                  style: 'currency', 
                  currency: 'BRL'  
                }).format(auctionInfoData?.order?.order ? (Number(auctionInfoData?.order?.order) / 100) : 0)}
          </span>
            </div>
            <span className="info">Você começará a ter lucro quando o leilão atingir {auctionInfoData?.gainValueFormat}</span>
            <div className="box-values">
              <h1 className="values">Valor total da compra: {auctionInfoData?.totalValueFormat}</h1>
            </div>
          </div>
				</form> 
			</Modal>
      <Modal
				handler={modal}
				onRequestClose={() => {
          setTermsCheck(false)
          setModal(false)
          setSeeInfos(false)
        }}
				title="CRIAR LEILÃO"
			>
				<form 
					accept-charset="utf-8"
					onSubmit={(e) => {
						e.preventDefault()
            if (!seeInfos) {
              handleCheckInfoBeforeCreateProduct(getValues())
            } 
            if (termsCheck && seeInfos) {
              handleCreateProduct(getValues())
            }
					}}
				>
          <Select
            classNamePrefix="react-select"
            className="react-select__container"
            placeholder="SELECIONE O PRODUTO"
            isClearable={true}
            options={products}
            formatOptionLabel={product => (
              <div className="selector-box">
                <div className="img-c">
                  <img src={product?.image} alt="product-image" />
                </div>
                <div className="label">
                  <h1>{String(product?.label).length < 25 ? product?.label : (String(product?.label).substring(0, 23) + "...")}</h1>
                  <span className="price">{product?.priceFormat}</span>
                  <span>{String(product?.description).length < 100 ? product?.description : (String(product?.description).substring(0, 100) + "...")}</span>
                </div>
              </div>
            )}
            onInputChange={(e) => {
              if (timeOut != null) {
                clearTimeout(timeOut)
              }
              timeOut = setTimeout(() => searchProducts(e), 1000)
            }}
            onChange={(e) => setValue('product', e?.value)}
          />
          <Input type="number" required label="Lances descontados" min={1} max={5} register={register('betsUse')} />
					<Input type="datetime-local" required label="Data de início"  register={register('startDate')} />
          <Input type="number" required label="Valor do cronometro em segundos" min={15} max={900} register={register('timer')} />
          <Select
            classNamePrefix="react-select"
            className="react-select__container"
            placeholder="ABILITAR INDICAÇÕES"
            isClearable={true}
            options={[{label: "PERMITIR QUE DIVULGEM MEU LEILÃO", value: true}, {label: "DESABILITAR DIVULGAÇÃO", value: false}]}
            onChange={(e) => {
              setEnableMark(Boolean(e?.value));
              Boolean(e?.value) == true ? setValue("mark", true) : setValue("mark", false);
            }}
          />
          {enableMark == true && <Input type="number" required={enableMark} label="Porcentagem por divulgação" min={1} max={50} register={register('markPercentage')} />}
          {
            seeInfos == true &&
            <>
              <div className="info-box">
              <div className="line">
                <span className="title">Produto</span>
                <span className="desc">{String(auctionInfoData?.productName).length < 25 ? auctionInfoData?.productName : (String(auctionInfoData?.productName).substring(0, 23) + "...")}</span>
              </div>
              <div className="line">
                <span className="title">Valor do produto</span>
                <span className="desc">{auctionInfoData?.productPriceFormat}</span>
              </div>
              <div className="line">
                <span className="title">Data de início</span>
                <span className="desc">
                  {auctionInfoData?.startDate &&
                    new Intl.DateTimeFormat("pt-br", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit" 
                    }).format(new Date(auctionInfoData?.startDate))
                  }
                </span>
              </div>
              <div className="line">
                <span className="title">Lances descontados</span>
                <span className="desc">{auctionInfoData?.betsUse}</span>
              </div>
              <div className="line">
                <span className="title">Valor do timer</span>
                <span className="desc">{auctionInfoData?.timer}</span>
              </div>
              <div className="line">
                <span className="title">Indicações</span>
                <span className="desc">{auctionInfoData?.mark == true ? "HABILITADO" : "DESABILITADO"}</span>
              </div>
              <div className="line">
                <span className="title">% de ganho</span>
                <span className="desc">{auctionInfoData?.percentGainFormat}</span>
              </div>
              <div className="line">
                <span className="title">% dos corretores</span>
                <span className="desc">{auctionInfoData?.markPercentageFormat}</span>
              </div>
              <div className="line">
                <span className="title">% da plataforma</span>
                <span className="desc">{auctionInfoData?.platformBetPercentFormat}</span>
              </div>
              <div className="line">
                <span className="title">Taxa de compra</span>
                <span className="desc">{auctionInfoData?.platformBuyPercentFormat}</span>
              </div>
              <span className="info">Você começará a ter lucro quando o leilão atingir {auctionInfoData?.gainValueFormat}</span>
              <div className="box-values">
                <h1 className="values">Valor total da compra: {auctionInfoData?.totalValueFormat}</h1>
              </div>
              </div>
            </>
          }
					<input disabled={loading} type="button" onClick={() => handleCheckInfoBeforeCreateProduct(getValues())} className="bt-orange" value={"CALCULAR LUCRO"} />
          {
            seeInfos == true && 
            <>
              <Input type="password" required label="Senha financeira / PIN" register={register('pin')} />
              <Input type="text" required label="2FA/OTP" register={register('otpAuth')} />
              <div className="check-box">
                <input type="checkbox" id="topping" name="topping" checked={termsCheck} onClick={() => setTermsCheck(!termsCheck)} /> Estou ciente que essa operação não é reversivel e não pode ser alterada, desejo continuar
              </div>
              {termsCheck && <input disabled={loading} type="submit" className="bt-green first" value={"CRIAR"} />}
            </>
          }
				</form> 
			</Modal>
    </>
  )
}