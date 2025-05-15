/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useEffect, useState } from "react";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { cpf, cnpj } from 'cpf-cnpj-validator'; 
import { toast } from "react-toastify";
import { UserContext } from "../../../hooks/contexts/UserContext";
import { api } from "../../../service/api";
import chevronSVG from "../../../assets/img/chevron-down.svg";
import dayjs from "dayjs";
import { AiFillEye, AiOutlineDollar } from "react-icons/ai";
import { Modal } from "../../Modal";
import { Input } from "../../Input";
import { useForm } from "react-hook-form";
import axios from "axios";

const status: any = {
  "w": "AGUARDANDO",
  "p": "PAGO",
  "x": "CANCELADO",
  "s": "ENVIADO"
}

export function WinnerPrize() {
  const { toggleLoading, loading, getBalance } = useContext(UserContext)
  const [cash, setCash] = useState<any>([])
  const [page, setPage] = useState(1)
  const [disable, setDisable] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState<any>()
  const [auctionInfoData, setAuctionInfoData] = useState<any>()
  const [buyCheck, setBuyCheck] = useState(false)
  const [sellCheck, setSellCheck] = useState(false)
  const [modal, setModal] = useState(false)
  const [inputCep, setInputCep] = useState('');
  const [inputDocument, setInputDocument] = useState('');
  const [inputPhone, setInputPhone] = useState('')


  const { register, getValues, reset, setValue } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
	});

  async function handlePagination() {
    toggleLoading(true)
    try {
      const response = await api.post("/auctions/winnerPrize/pagination", {page})
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

  async function handleSeeAuctionWinner() {
    try {
      const response = await api.post('/auctions/user/winner/info', {auction: selectedAuction?.id})
      setAuctionInfoData(response.data)
      setModal(true)
    } catch(err: any) {}
  }

  async function handleSellAuction(data: any) {
    if (!sellCheck) {
      toast(`Confirme que deseja vender o produto`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
      return;
    }
    toggleLoading(true)
    try {
      await api.post("/auctions/user/winner/sell", {auction: selectedAuction.id, ...data})
      reset({})
			toast(`Produto vendido com sucesso!`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
      setModal(false)
      getBalance();
      if (page == 1) {
        handlePagination()
      } else {
        setPage(1)
      }
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
    toggleLoading(false)
  }

  async function getAddressByCep() {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${inputCep}/json/`);
      reset({
        locality: response.data.bairro,
        address: response.data.logradouro,
        city: response.data.localidade,
        state: response.data.uf,
        complement: response.data.complemento,
      })
    } catch (err: any) {
      toast(`CEP incorreto, por favor insira um cep valido`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
  }

  async function handleBuyAuction(data: any) {
    if (!buyCheck) {
      toast(`Confirme que deseja comprar o produto`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
      return;
    }
    toggleLoading(true)
    data.address = `${data.address} N.${data.number}`;
    try {
      await api.post("/auctions/user/winner/buy", 
      {
        auctionId: selectedAuction.id, 
        postalCode: inputCep,
        country: 'Brasil',
        document: inputDocument,
        phone: inputPhone,
        token: selectedAuction.token,
        ...data
      })
      reset({})
			toast(`Leilão pago com sucesso!`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
      setModal(false)
      getBalance();
      if (page == 1) {
        handlePagination()
      } else {
        setPage(1)
      }
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
    toggleLoading(false)
  }

  function validateDocument() {
    const cleanInput = inputDocument.replace(/[^0-9]/g, '')
    if (cleanInput.length === 11) {
      const isValid = cpf.isValid(cleanInput)
      if (!isValid) {
        toast(`Documento incorreto, por favor insira um documento valido`, {
          style: { backgroundColor: "var(--red-1)", color: "#fff" },
          progressStyle: { background: "darkred" },
        });
        return
      }
      setInputDocument(cpf.format(cleanInput))
      setValue('typeDocument', 'CPF')
    } else if (cleanInput.length === 14) {
      const isValid = cnpj.isValid(cleanInput)
      if (!isValid) {
        toast(`Documento incorreto, por favor insira um documento valido`, {
          style: { backgroundColor: "var(--red-1)", color: "#fff" },
          progressStyle: { background: "darkred" },
        });
        return
      }
      setInputDocument(cnpj.format(cleanInput))
      setValue('typeDocument', 'CNPJ')
    } else {
      toast(`Documento incorreto, por favor insira um documento valido`, {
        style: { backgroundColor: "var(--red-1)", color: "#fff" },
        progressStyle: { background: "darkred" },
      });
      setInputDocument('')
      setValue('typeDocument', '')
    }
  }

  useEffect(() => {
    if (selectedAuction) {
      handleSeeAuctionWinner()
    }
  }, [selectedAuction])


  return(
    <>
      <div className="table-c">
        <h2 className="title">MEUS LEILÕES ARREMATADOS</h2>
        <table className="tbl">
          <thead>
            <tr>
              <th className="tx-l">ID</th>
              <th className="tx-c">Data de início</th>
              <th className="tx-l">Produto</th>
              <th>Valor</th>
              <th>Pagamento</th>
              <th className="tx-l">Envio</th>
              <th className="tx-r">Menu</th>
            </tr>
          </thead>
          <tbody>
            {
              cash && cash.map((c: any) => (
                <tr>
                  <td className="tx-l">{c?.id}</td>
                  <td className="tx-c">{c?.startDate && dayjs(c?.startDate).format("DD-MM-YYYY HH:mm")}</td>
                  <td>{c?.productName}</td>
                  <td>$ {(Number(c?.order || 0) / 100).toFixed(2)}</td>
                  <td>{status[c?.statusBilling]}</td>
                  <td className="tx-l">{status[c?.statusShipping]}</td>
                  <td className="tx-r">
                    <a 
                      title="Informações"
                      onClick={() => setSelectedAuction(c)} 
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
				handler={modal}
				onRequestClose={() => {
          setModal(false)
        }}
				title={`Leilão ${auctionInfoData?.auction}`}
			>
				<form 
					accept-charset="utf-8"
					onSubmit={(e) => {
						e.preventDefault()
            if (sellCheck) {
              handleSellAuction(getValues())
            }
            if (buyCheck) {
              handleBuyAuction(getValues())
            }
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
              <span className="title">Venda o produto por</span>
              <span className="desc">{auctionInfoData?.sellValueFormat}</span>
            </div>
            <div className="line">
              <span className="title">Arrematado por</span>
              <span className="desc">{auctionInfoData?.auctionValueFormat}</span>
            </div>
            <div className="line">
              <span className="title">Pagamento</span>
              <span className="desc">{status[selectedAuction?.statusBilling]}</span>
            </div>
            <div className="line">
              <span className="title">Envio</span>
              <span className="desc">{status[selectedAuction?.statusShipping]}</span>
            </div>
            {
              selectedAuction?.prizeType == "p" &&
              <>
                <div className="line">
                  <span className="title">CEP</span>
                  <span className="desc">{selectedAuction?.postalCode}</span>
                </div>
                <div className="line">
                  <span className="title">Endereço</span>
                  <span className="desc">{selectedAuction?.address}</span>
                </div>
                <div className="line">
                  <span className="title">Bairro</span>
                  <span className="desc">{selectedAuction?.locality}</span>
                </div>
                <div className="line">
                  <span className="title">Cidade</span>
                  <span className="desc">{selectedAuction?.city}</span>
                </div>
              </>
            }
            {
              selectedAuction?.statusBilling === "w" && 
              <>
                <div className="box-values">
                  <h1 className="values">Valor do arremate: {auctionInfoData?.buyValueFormat}</h1>
                  <h1 className="values">Pagamos {auctionInfoData?.sellValueFormat} por seu produto.</h1>
                  <h1 className="values" style={{paddingTop: 15}}>(ABATEMOS O VALOR DO ARREMATE NO MOMENTO DA TRANSAÇÃO)</h1>
                </div>
              </>
            }
            {
              selectedAuction?.statusBilling !== "w" && 
              <>
                <div className="box-values">
                  <h1 className="values">Em casos de duvida entre em contato com nosso suporte</h1>
                </div>
              </>
            }
          </div>
          {
            selectedAuction?.statusBilling === "w" &&
            <>
              {
                buyCheck && 
                <>
                  <Input type="text" required label="CEP" onBlur={() => getAddressByCep()} onChange={(e) => setInputCep(String(e.target.value).replace(/[^0-9-]/g, ''))} value={inputCep} />
                  <Input type="text" required disabled label="Estado" register={register('state')}  />
                  <Input type="text" required disabled label="Cidade" register={register('city')}  />
                  <Input type="text" required disabled label="Bairro" register={register('locality')}  />
                  <Input type="text" required disabled label="Endereço" register={register('address')}  />
                  <Input type="text" required label="Número" register={register('number')}  />
                  <Input type="text" required label="Complemento" register={register('complement')}  />
                  <Input type="text" required label="Nome completo" register={register('name')}  />
                  <Input 
                    type="text" 
                    required 
                    label="Documento" 
                    onChange={(e) => setInputDocument(String(e.target.value).replace(/[^0-9-]/g, ''))} 
                    value={inputDocument}
                    minLength={11}
                    onBlur={validateDocument} 
                  />
                  <PhoneInput
                    placeholder="Telefone"
                    style={{width: '100%', border: '1px solid var(--gray-2)', padding: 15, marginTop: 20, borderRadius: 'var(--inpt-radius)'}}
                    value={inputPhone}
                    onChange={(e) => setInputPhone(String(e))}
                  />
  
                </>
              }
              {
                (sellCheck || buyCheck) &&
                <>
                  <Input type="password" required label="Senha financeira / PIN" register={register('pin')}  />
                  <Input type="text" required label="2FA/OTP" register={register('otpAuth')}  />
                </>
              }
              <div className="check-box">
                <input type="checkbox" id="topping" name="topping" checked={sellCheck} onClick={() => {
                  setBuyCheck(!sellCheck == true ? false : buyCheck)
                  setSellCheck(!sellCheck)
                  }} /> QUERO VENDER MEU PRODUTO
              </div>
              <div className="check-box" style={{padding: 0}}>
                <input type="checkbox" id="topping" name="topping" checked={buyCheck} onClick={() => {
                  setSellCheck(!buyCheck == true ? false : sellCheck)
                  setBuyCheck(!buyCheck)
                  }} /> DESEJO RECEBER ESSE PRODUTO
              </div>
              {buyCheck && <input disabled={loading} type="submit" className="bt-green" value={"COMPRAR"} />}
              {sellCheck && <input disabled={loading} type="submit" className="bt-orange" value={"VENDER"} />}
            </>
          }
				</form> 
			</Modal>
    </>
  )
}