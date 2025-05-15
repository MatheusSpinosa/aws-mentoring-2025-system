/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/img/logo.svg";
import { UserContext } from "../../hooks/contexts/UserContext";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { api } from "../../service/api";
import { Modal } from "../Modal";


const schemaRegister = Yup.object().shape({
  name: Yup.string().min(3).required('Nome é um campo obrigatório'),
	username: Yup.string().min(5,"O login deve conter no minimo 5 digitos").max(40,"O login deve conter no maximo 40 digitos").required('E-mail é um campo obrigatório'),
  email: Yup.string().email('E-mail invalido').required('E-mail é um campo obrigatório'),
  password: Yup.string().min(6, "A senha deve conter no minimo 6 caracteres").required('Senha é um campo obrigatório'),
	confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Senhas não conferem')
});

const schemaLogin = Yup.object().shape({
  email: Yup.string().required('Nome de usuário obrigatório'),
  password: Yup.string().required('Senha é um campo obrigatório'),
});

export function Footer() {
  const { user, loading, toggleLoading, handleUserLogin, handleUserLogout } = useContext(UserContext)
  const history = useHistory()

	const [modalRegister, setModalRegister] = useState(false)
	const [modalLogin, setModalLogin] = useState(false)
	const [userInitials, setUserInitials] = useState('')

	const { register, getValues, reset } = useForm<any>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
	});
	
	const { register: registerLogin, getValues: getValuesLogin, reset: resetLogin } = useForm<any>({
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

		try {
      await api.post("/customer/create", getValues());
      reset({})
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
      resetLogin({})
			setModalLogin(false)
    } catch (err: any) {
      toast(`${err}`.split(':')[1], {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
		toggleLoading(false)
	}

	useEffect(() => {
		if (!user?.user?.userName) {
			return;
		}
		const initial = String(user?.user?.userName).split(' ');
		if (initial.length > 1) {
			setUserInitials(`${initial[0][0]}${initial[1][0]}`)
		} else {
			setUserInitials(`${initial[0][0]}${initial[0][2]}`)
		}
	}, [user])
  return(
    <>
      <footer>
        <div className="cnt">
          <div className="pt-1">
            <img src={logo} className="logo" title="Logo" />
            <nav className="menu">
              <NavLink to="/" className="link">Leilões Online</NavLink>
            </nav>
          </div>
          <div className="pt-2">
          {
            !user?.user?.userName &&
            <div className="bt-c">
              <a onClick={() => setModalLogin(true)} className="bt-1">LOGIN</a>
              {/* <a className="bt-2" onClick={() => setModalRegister(true)}>CADASTRE-SE</a> */}
            </div>
          }
          {
            user?.user?.userName &&
            <div className="profile" style={{display: "flex"}}>
              <div className="txt-c">
                <NavLink to="/dashboard" className="link" >{user?.user?.userName}</NavLink>
                <a className="link" onClick={() => handleUserLogout()}>Sair</a>
              </div>
              <div className="fl" onClick={() => history.push("/dashboard")}>{userInitials.toUpperCase()}</div>
            </div>
          }
          </div>
        </div>
        <div className="copy">BKode © 2022 - All Rights Reserved</div>
      </footer>
      <Modal
				handler={modalLogin}
				onRequestClose={() => setModalLogin(false)}
				title="ENTRAR"
			>
				<form 
					accept-charset="utf-8"
					onSubmit={(e) => {
						e.preventDefault()
						handleLoginUser()
					}}
				>
					<input type="text" placeholder="USUÁRIO"{...registerLogin('email')} />
					<input type="password" placeholder="SENHA" {...registerLogin('password')} />
					<input disabled={loading} type="submit" className="bt-green first" value="ENTRAR" />
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
					<input type="text" placeholder="NOME" {...register('name')} />
					<input type="text" placeholder="USUÁRIO"{...register('username')} />
					<input type="text" placeholder="E-MAIL"{...register('email')} />
					<input type="password" placeholder="SENHA" {...register('password')} />
					<input type="password" placeholder="CONFIRMAR SENHA" {...register('confirmPassword')} />
					<input disabled={loading} type="submit" className="bt-green first" value="ENVIAR" />
				</form> 
			</Modal>
    </>
  )
}