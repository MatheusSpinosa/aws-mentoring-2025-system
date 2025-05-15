/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";

import listSVG from "../../assets/img/list.svg";
import ticketSVG from "../../assets/img/ticket.svg";
import lockSVG from "../../assets/img/lock.svg";
import { Modal } from "../../components/Modal";
import { useContext, useState } from "react";
import { UserContext } from "../../hooks/contexts/UserContext";
import { useForm } from "react-hook-form";
import { api } from "../../service/api";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { RiAuctionLine, RiLockPasswordLine, RiSendPlaneFill, RiTimerFlashFill, RiMoneyDollarCircleFill } from 'react-icons/ri';
import { GiTakeMyMoney } from 'react-icons/gi';
import { AiFillCrown } from 'react-icons/ai';
import QRCode from "react-qr-code";

import * as Yup from "yup";
import { TableCash } from "../../components/Tables/Cash";
import { WinnerPrize } from "../../components/Tables/WinnerPrize";
import { MyAuctions } from "../../components/Tables/MyAuctions";
import { TableBets } from "../../components/Tables/Bets";
import { Input } from "../../components/Input";


const schemaPassword = Yup.object().shape({
  password: Yup.string().min(6, "A senha deve conter no minimo 6 caracteres").required('Senha é um campo obrigatório'),
	confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Senhas não conferem')
});
const schemaPin= Yup.object().shape({
  pin: Yup.string().required('Senha é um campo obrigatório'),
	confirmPin: Yup.string().oneOf([Yup.ref('pin'), null], 'Senhas não conferem')
});


export function Dashboard() {
  const { loading, toggleLoading, user, balance, getBalance } = useContext(UserContext)
  const history = useHistory()

  const [modalCoupon, setModalCoupon] = useState(false)
  const [modalChangePassword, setModalChangePassword] = useState(false)
  const [modalChangePin, setModalChangePin] = useState(false)
  const [modalOtp, setModalOtp] = useState(false)
  const [userHavePin, setUserHavePin] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [table, setTable] = useState('cash')
  const [otp, setOtp] = useState<any>()
  const [inputOtp, setInputOtp] = useState('')

  async function handleRedemptionCoupon() {
    toggleLoading(true)
    try {
      await api.post("/coupons/use", {code: coupon});
			toast(`Cupom resgatado com sucesso`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
			setModalCoupon(false)
      setCoupon('')
      getBalance()
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
    toggleLoading(false)
  }

  const { register: registerPin, getValues: getValuesPin, reset: resetPin } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
	});

  async function handleChangePin() {
    toggleLoading(true)

    const validateForm = await schemaPin.validate(getValuesPin()).catch(function(e) {
			toast(`${e}`.split(':')[1], {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
		});
    // --- Check if password is strong --- //
    const strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );

    const pinIsStrong = strongRegex.test(getValuesPin()?.pin);

    if (!pinIsStrong) {
      toast(`A senha financeira deve contar no minomo 8 caracteres, com letras maiusculas, minusculas, numeros e um caracter especial`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
		if (!validateForm || !pinIsStrong) {
			toggleLoading(false)
			return;
		}

    try {
      await api.post("/password/pin/update", getValuesPin());
			toast(`Senha alterada com sucesso`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
			setModalChangePin(false)
      resetPin({})
      checkIfUserHavePin()
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
    toggleLoading(false)
  }

  async function checkIfUserHavePin() {
    try {
      const response = await api.get('/password/pin');
      setUserHavePin(response.data)
    } catch (err) {}
  }

  const { register, getValues, reset } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
	});

  async function handleChangePassword() {
    toggleLoading(true)

    const validateForm = await schemaPassword.validate(getValues()).catch(function(e) {
			toast(`${e}`.split(':')[1], {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
		});
		if (!validateForm) {
			toggleLoading(false)
			return;
		}

    try {
      await api.post("/users/changePassword", getValues());
			toast(`Senha alterada com sucesso`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
			setModalChangePassword(false)
      reset({})
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
    toggleLoading(false)
  }

  async function checkOtpAuth() {
    try {
      const response = await api.get('/users/otp')
      setOtp(response.data)
    } catch(err: any) {}
  }

  async function handleValidateOtp() {
    toggleLoading(true)
    try {
      await api.post("/users/otp/validate", {otp: inputOtp});
			toast(`2FA/OTP validado com sucesso`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
			setModalOtp(false)
      setInputOtp('')
      setOtp(null)
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
    toggleLoading(false)
  }


  return(
    <>
      <Header />
      <section className="content content-7">
        <div className="title-c">
          <h1 className="title">MINHA CONTA</h1>
        </div>

        <div className="balance" style={{display: 'flex', flexDirection: 'column'}}>
          <span className="txt">LANCES: {balance?.balance || 0} lances</span>
          <div>
            <a onClick={() => getBalance()} className="mini-bt" style={{margin: 0}}>ATUALIZAR</a>
            <a onClick={() => ("changeCnt(5);")} className="mini-bt" style={{margin: 0}}>DEPOSITAR</a>
          </div>
        </div>

        <nav className="dash-c">
          <a onClick={() => setTable('cash')} className="link">
            <div className="img-c">
              <img src={listSVG} />
            </div>
            <div className="txt">Extrato</div>
          </a>
          <a onClick={() => setTable('my-auctions')} className="link">
            <div className="img-c">
              <RiAuctionLine style={{width: '87%', height: '87%', fill: "#09523c"}} />
            </div>
            <div className="txt">Leilões</div>
          </a>
          <a onClick={() => setModalCoupon(true)} className="link">
            <div className="img-c">
              <img src={ticketSVG} />
            </div>
            <div className="txt">Cupons</div>
          </a>
          <a onClick={() => setModalChangePassword(true)} className="link">
            <div className="img-c">
              <img src={lockSVG} />
            </div>
            <div className="txt">Senha</div>
          </a>
          <a onClick={() => setModalChangePin(true)} className="link">
            <div className="img-c">
              <RiLockPasswordLine style={{width: '87%', height: '87%', fill: "#09523c"}} />
            </div>
            <div className="txt">PIN</div>
          </a>
          <a onClick={() => setModalOtp(true)} className="link">
            <div className="img-c">
              <RiTimerFlashFill style={{width: '87%', height: '87%', fill: "#09523c"}} />
            </div>
            <div className="txt">2FA/OTP</div>
          </a>
          <a onClick={() => setTable('cash-bets')} className="link">
            <div className="img-c">
              <RiSendPlaneFill style={{width: '87%', height: '87%', fill: "#09523c"}} />
            </div>
            <div className="txt">Lances</div>
          </a>
          <a onClick={() => setTable('auctions')} className="link">
            <div className="img-c">
              <AiFillCrown style={{width: '87%', height: '87%', fill: "#09523c"}} />
            </div>
            <div className="txt">Arremates</div>
          </a>
          <a onClick={() => setTable('auctions')} className="link">
            <div className="img-c">
              <RiMoneyDollarCircleFill style={{width: '87%', height: '87%', fill: "#09523c"}} />
            </div>
            <div className="txt">Depositar</div>
          </a>
          <a onClick={() => setTable('auctions')} className="link">
            <div className="img-c">
              <GiTakeMyMoney style={{width: '87%', height: '87%', fill: "#09523c"}} />
            </div>
            <div className="txt">Sacar</div>
          </a>

        </nav>
        {table == 'cash' && <TableCash /> }
        {table == 'cash-bets' && <TableBets /> }
        {table == 'auctions' && <WinnerPrize />}
        {table == 'my-auctions' && <MyAuctions />}
        
      </section>
      <Footer />
      <Modal
        handler={modalCoupon}
        onRequestClose={() => {
          setModalCoupon(false)
          
        }}
        title="RESGATAR CUPOM"
      >
        <form 
          accept-charset="utf-8"
          onSubmit={(e) => {
            e.preventDefault()
            handleRedemptionCoupon()
          }}
        >
          <Input type="text" label="Cupom" onChange={(e) => setCoupon(e.target.value)} value={coupon} required />
          <input disabled={loading} type="submit" className="bt-green first" value="RESGATAR" />
        </form> 
      </Modal>
      <Modal
        handler={modalChangePassword}
        onRequestClose={() => {
          reset({})
          setModalChangePassword(false)
        }}
        title="ALTERAR SENHA"
      >
        <form 
          accept-charset="utf-8"
          onSubmit={(e) => {
            e.preventDefault()
            handleChangePassword()
          }}
        >
          <Input type="password" label="Senha antiga" register={register("oldPassword")} required />
          <Input type="password" label="NOVA SENHA" register={register("password")} required />
          <Input type="password" label="CONFIRMAR NOVA SENHA" register={register("confirmPassword")} required />
          <input disabled={loading} type="submit" className="bt-green first" value="ALTERAR SENHA" />
        </form> 
      </Modal>
      <Modal
        handler={modalChangePin}
        onRequestClose={() => {
          reset({})
          setModalChangePin(false)
        }}
        title="ALTERAR SENHA FINANCEIRA"
      >
        <form 
          accept-charset="utf-8"
          onSubmit={(e) => {
            e.preventDefault()
            handleChangePin()
          }}
        >
          {userHavePin && <Input type="password" label="Senha antiga" register={registerPin("oldPin")} required />}
          <Input type="password" label="Nova senha" register={registerPin("pin")} required />
          <Input type="password" label="Confirmar senha" register={registerPin("confirmPin")} required />
          <input disabled={loading} type="submit" className="bt-green first" value="ALTERAR PIN" />
        </form> 
      </Modal>
      <Modal
        handler={modalOtp}
        onRequestClose={() => {
          reset({})
          setModalOtp(false)
        }}
        title="VALIDAÇÃO DO 2FA/OTP"
      >
        <form 
          accept-charset="utf-8"
          onSubmit={(e) => {
            e.preventDefault()
            handleValidateOtp()
          }}
        >
          {
            otp && 
            <>
              <QRCode value={otp?.qrCode} />
              <h1 style={{marginTop: 15}}>{otp?.ga_secret}</h1>
              <Input type="text" label="VALIDAR 2FA/OTP" onChange={(e) => setInputOtp(e.target.value)} value={inputOtp} required />
              <input disabled={loading} type="submit" className="bt-green first" value="VALIDAR" />
            </>
          }
          {
            !otp && <h1>SEU 2FA/OTP JÁ FOI VALIDADO COM SUCESSO</h1>
          }
        </form> 
      </Modal>
    </>
  )
}