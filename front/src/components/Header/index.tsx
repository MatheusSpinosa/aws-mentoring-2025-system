/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useEffect, useState } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';

import logo from '../../assets/img/logo.svg'
import { Modal } from '../Modal';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { api } from '../../service/api';
import { UserContext } from '../../hooks/contexts/UserContext';
import menuSVG from '../../assets/img/menu-open.svg';
import menuCloseSVG from '../../assets/img/menu-close.svg';
import { Input } from '../Input';

const schemaRegister = Yup.object().shape({
  name: Yup.string().min(3).required('Nome é um campo obrigatório'),
  username: Yup.string().min(5,"O login deve conter no minimo 5 digitos").max(40,"O login deve conter no maximo 40 digitos").required('E-mail é um campo obrigatório'),
  email: Yup.string().email('E-mail invalido').required('E-mail é um campo obrigatório'),
  password: Yup.string().min(6, "A senha deve conter no minimo 6 caracteres").required('Senha é um campo obrigatório'),
	confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Senhas não conferem')
});

const schemaLogin = Yup.object().shape({
  username: Yup.string().required('Nome de usuário obrigatório'),
  password: Yup.string().required('Senha é um campo obrigatório'),
});
const schemaActiveAccount = Yup.object().shape({
  username: Yup.string().required('Nome de usuário obrigatório'),
  confirmationCode: Yup.string().required('Código é um campo obrigatório'),
});

export function Header() {
	const { user, loading, toggleLoading, handleUserLogin, handleUserLogout, balance, getBalance } = useContext(UserContext)
	const history = useHistory()

	const [sidebarOpen, setSidebarOpen] = useState('');
	const [modalRegister, setModalRegister] = useState(false)
	const [modalActiveAccount, setModalActiveAccount] = useState(false)
	const [modalLogin, setModalLogin] = useState(false)
	const [modalAuction, setModalAuction] = useState(false)
	const [forgot, setForgot] = useState(false)
	const [userInitials, setUserInitials] = useState('')
	const [modalCoupon, setModalCoupon] = useState(false)
	const [coupon, setCoupon] = useState('')
	const [imageBase64, setImageBase64] = useState<string | null>(null);
	
	const { search } = useLocation();
	const reg = (new URLSearchParams(search)).get('reg');

	const { register, getValues, reset } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
	});
	
	const { register: registerLogin, getValues: getValuesLogin, reset: resetLogin } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
	});
	
	const { register: registerActive, reset: resetActive, handleSubmit } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
	});

	const { register: registerAuction, reset: resetAuction } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
	});

	async function handleRegisterUser() {
		toggleLoading(true)
		const validateForm = await schemaRegister.validate(getValues()).catch(function(e) {
			toast(`${e}`.split(':')[1], {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
		});
		if (!validateForm) {
			toggleLoading(false)
			return;
		}
		const values = getValues()
		try {
      await api.post("/customer/create", {
				...values,
				username: values.username,
			});
      reset({
				name: '',
				username: '',
				email: '',
				password: '',
				confirmPassword: ''
			})
			toast(`Usuário cadastrado com sucesso`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
			setModalRegister(false)
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
		toggleLoading(false)
	}
	async function handleForgotPassword() {
		toggleLoading(true)

		try {
      await api.post("/password/forgot", getValuesLogin())
      resetLogin({})
			setModalLogin(false)
			toast(`E-mail de recuperação enviado com sucesso`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
		toggleLoading(false)
	}
	async function handleLoginUser() {
		toggleLoading(true)
			const validateForm = await schemaLogin.validate(getValuesLogin()).catch(function(e) {
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
				await handleUserLogin(getValuesLogin())
				resetLogin()
				setModalLogin(false)
			} catch (err: any) {
				toast(`${err?.response?.data?.message}`, {
					style: { backgroundColor: "var(--red-1)", color: "#fff" },
					progressStyle: { background: "darkred" },
				});
			}
			toggleLoading(false)
	}
	async function handleActiveAccount(data: any) {
		toggleLoading(true)
			const validateForm = await schemaActiveAccount.validate(data).catch(function(e) {
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
				await api.post("/customer/confirm", data)
				resetActive()
				setModalLogin(false)
			} catch (err: any) {
				toast(`${err?.response?.data?.message}`, {
					style: { backgroundColor: "var(--red-1)", color: "#fff" },
					progressStyle: { background: "darkred" },
				});
			}
			toggleLoading(false)
	}
	async function handleRedemptionCoupon() {
		if (!coupon) {
			toast(`Campo cupom é obrigatório`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
			return;
		}
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
	async function handleCreateAuction(values: any) {
		if (!imageBase64) {
			toast(`Você precisa fornecer uma imagem`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
			return;
		}
    toggleLoading(true)
    try {
			await api.post("/auction/create", {
				...values,
				startDate: new Date(values.startDate).getTime(),
				image: imageBase64,
			});
			toast(`Leilão criado com sucesso`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
			setModalAuction(false)
      setImageBase64(null)
			resetAuction({})
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
    toggleLoading(false)
  }

	useEffect(() => {
		if (reg && !user?.user?.userName) {
			setModalRegister(true)
		}
		if (!user?.user?.userName) {
			return;
		}
		const initial = String(user?.user?.userName).split(' ');
		if (initial.length > 1) {
			setUserInitials(`${initial[0][0]}${initial[1][0]}`)
		} else {
			setUserInitials(`${initial[0][0]}${initial[0][1]}`)
		}
	}, [user])

  return(
		<>
			<header className={sidebarOpen}>
				<img onClick={() => history.push("/")} src={logo} className="logo" title="Logo" />
				<nav className="menu">
					<NavLink to="/" className="link">Leilões Online</NavLink>
					<div onClick={() => setModalActiveAccount(true)} className="link">Ativar Conta</div>
					<div onClick={() => getBalance(true)} className="link">Saldo</div>
					<div onClick={() => setModalCoupon(true)} className="link">Resgatar Cupom</div>
					<div onClick={() => setModalAuction(true)} className="link">Criar Leilão</div>
				</nav>
				{
					!user?.user?.userName &&
					<div className="bt-c">
						<a onClick={() => setModalLogin(true)} className="bt-1">LOGIN</a>
						<a className="bt-2" onClick={() => setModalRegister(true)} >CADASTRE-SE</a>
					</div>
				}
				
				{
					user?.user?.userName &&
					<div className="profile">
						<div className="txt-c">
							<a className="txt">Lances</a>
							<a className="txt">{balance?.balance || 0}</a>
						</div>
						<div className="txt-c">
							<NavLink className="link" to="/dashboard">{user?.user?.userName}</NavLink>
							<a className="link" onClick={() => handleUserLogout()}>Sair</a>
						</div>
						<div className="fl" onClick={() => history.push("/dashboard")}>{userInitials.toUpperCase()}</div>
					</div>
				}

				<img src={menuSVG} className="icon-mob" title="Menu" onClick={() => setSidebarOpen('open')} />
				<div className="close-c">
					<img src={menuCloseSVG} className="cl" title="Close Menu" onClick={() => setSidebarOpen('')} />
				</div>
			</header>
			<Modal
				handler={modalLogin}
				onRequestClose={() => setModalLogin(false)}
				title="ENTRAR"
			>
				<form 
					accept-charset="utf-8"
					onSubmit={(e) => {
						e.preventDefault()
						if (forgot) {
							handleForgotPassword()
						} else {
							handleLoginUser()
						}
					}}
				>
					<Input type="text" label="Usuário" register={registerLogin('username')} />
					{!forgot && <Input type="password" label="Senha" register={registerLogin('password')} />}
					<input disabled={loading} type="submit" className="bt-green first" value={forgot ? "ENVIAR" : "ENTRAR"} />
					<input disabled={loading} type="button" onClick={() => setForgot(!forgot)} className="bt-red first" value={forgot ? "LOGIN" : "ESQUECI MINHA SENHA"} />
				</form> 
			</Modal>
			<Modal
				handler={modalRegister}
				onRequestClose={() => setModalRegister(false)}
				title="CADASTRAR-SE"
			>
				<form 
					accept-charset="utf-8"
					onSubmit={(e) => {
						e.preventDefault()
						handleRegisterUser()
					}}
				>
					
					<Input type="text" label="Nome" register={register('name')} />
					<Input type="text" label="Usuário" register={register('username')} />
					<Input type="text" label="E-mail" register={register('email')} />
					<Input type="password" label="Senha" register={register('password')} />
					<Input type="password" label="Confirmar senha" register={register('confirmPassword')} />
					<input disabled={loading} type="submit" className="bt-green first" value="ENVIAR" />
				</form> 
			</Modal>
			<Modal
				handler={modalActiveAccount}
				onRequestClose={() => setModalActiveAccount(false)}
				title="ATIVAR CONTA"
			>
				<form 
					accept-charset="utf-8"
					onSubmit={handleSubmit(handleActiveAccount)}
				>
					<Input type="text" label="Usuário" register={registerActive('username')} />
					<Input type="text" label="Código" register={registerActive('confirmationCode')} />
					<input disabled={loading} type="submit" className="bt-green first" value="CONFIRMAR" />
				</form> 
			</Modal>
			<Modal
				handler={modalAuction}
				onRequestClose={() => setModalAuction(false)}
				title="CRIAR LEILÃO"
			>
				 <form
					accept-charset="utf-8"
					onSubmit={async (e) => {
						e.preventDefault();
						const values = getValues();
						handleCreateAuction(values)
					}}
				>
					<Input
						type="file"
						required
						label="Imagem do leilão"
						onChange={async (e) => {
							const file = e?.target?.files?.[0];
							if (file) {
								const reader = new FileReader();
								reader.onloadend = () => {
									setImageBase64(reader.result as string);
								};
								reader.readAsDataURL(file);
							}
						}}
					/>
					<Input type="text" required label="Nome" register={register('name')} />
					<Input type="datetime-local" required label="Data de início" register={register('startDate')} />
					{/* <Input type="number" required label="Valor do cronometro em segundos" min={15} max={900} register={register('counter')} /> */}
					<input disabled={loading} type="submit" className="bt-green first" value={"CRIAR"} />
				</form>
			</Modal>
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
		</>
  )
}