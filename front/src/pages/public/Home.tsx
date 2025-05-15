/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Header } from "../../components/Header";

import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import bannerTop from "../../assets/img/banner-top.jpg";
import chevronDown from "../../assets/img/chevron-down.svg";
import { CardAuction } from "../../components/CardAuction";
import { Footer } from "../../components/Footer";
import { Modal } from "../../components/Modal";
import { SocketContext } from "../../hooks/contexts/SocketContext";
import { UserContext } from "../../hooks/contexts/UserContext";
import { api } from "../../service/api";



export function Home() {
  const { loading, toggleLoading } = useContext(UserContext)
  const { lastConnectionDate } = useContext(SocketContext)

  // ----------------------------------------------------------------------------------------------------
  // --- Auctions
  // ----------------------------------------------------------------------------------------------------
  const [auctions, setAuctions] = useState<any>([])
  const [page, setPage] = useState(1)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [disable, setDisable] = useState(false)
  const [modal, setModal] = useState(false)

  async function handlePageAuctions() {
    toggleLoading(true)
    try {
      const response = await api.get(`/auction`);
      if (response.data.length > 0 && page === 1) {
        setAuctions([...response.data]);
      } else if (response.data.length > 0 && page > 1) {
        setAuctions([...auctions, ...response.data])
      } else if ((page > 1 && response.data.length < 1)) {
        setDisable(true);
      }

      if (response.data.length < 25) {
        setDisable(true)
      }
    } catch (err) {
      
    }
    toggleLoading(false)
  }

  useEffect(() => {
    handlePageAuctions()
  }, [page])
  
  useEffect(() => {
    async function clearAuctions() {
      setAuctions([])
    };
    async function resetAuctions() {
      await clearAuctions()

      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (page === 1) {
        handlePageAuctions()
      }
      if (page > 1) {
        setPage(1)
      }
    };
    if (lastConnectionDate > 1) {
      resetAuctions()
    }
  }, [lastConnectionDate])

  // ----------------------------------------------------------------------------------------------------
  // --- Validate account
  // ----------------------------------------------------------------------------------------------------
  const { search } = useLocation();
  const activeAccount = (new URLSearchParams(search)).get('active-account');

  async function handleActiveAccount(token: string) {
    try {
      await api.post(`/users/active`, {token: token});
      toast(`Usuário ativado com sucesso`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
  }

  const token = (new URLSearchParams(search)).get('token');

  useEffect(() => {
    if (String(activeAccount) === 'true' && token) {
      const getToken = String(search).split("token=")[1]
      handleActiveAccount(getToken)
    }
  }, [])

  // ----------------------------------------------------------------------------------------------------
  // --- Reset password
  // ----------------------------------------------------------------------------------------------------
  const reset = (new URLSearchParams(search)).get('reset');

  useEffect(() => {
    if (String(reset) === 'true' && token) {
      setModal(true)
    }
  }, [])

  async function handleResetPassword(token: string | null, password: string) {
    if (!token) {
      toast(`Token invalido`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
      return;
    }
    if (!password || password !== passwordConfirm) {
      toast(`Senhas não conferem`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
      return;
    }
    try {
      await api.post(`/password/reset`, {token: token, password, confirmPassword: passwordConfirm});
      toast(`Senha alterada com sucesso`, {
        style: { backgroundColor: "#00A300", color: "#fff", position: "absolute" },
        progressStyle: { background: "darkgreen" },
      });
      setModal(false)
    } catch (err: any) {
      toast(`${err?.response?.data?.message}`, {
				style: { backgroundColor: "var(--red-1)", color: "#fff" },
				progressStyle: { background: "darkred" },
			});
    }
  }

  return(
    <>
      <Header />

      <div className="content-1">

        {/* <!-- banner --> */}
        <section className="banner-top">
          <img src={bannerTop} className="banner" />
        </section>


        {/* <!-- product grid --> */}
        <section className="content">
          <div className="title-c">
            <h1 className="title">LEILÕES ONLINE AGORA</h1>
          </div>

          <div className="prod-grid">
            {
              auctions && auctions.map((auction: any) => (
                <CardAuction auction={auction} />
              ))
            }
          </div>
        </section>
      </div>
      <Footer />
      <Modal
				handler={modal}
				onRequestClose={() => setModal(false)}
				title="RESETAR SENHA"
			>
				<form 
					accept-charset="utf-8"
					onSubmit={(e) => {
						e.preventDefault()
						const getToken = String(search).split("token=")[1]
            handleResetPassword(getToken, password)
					}}
				>
					<input 
            type="password" 
            placeholder="NOVA SENHA" 
            onChange={(e) => setPassword(e.target.value)} 
          />
					<input 
            type="password"
            placeholder="CONFIRMAR SENHA" 
            onChange={(e) => setPasswordConfirm(e.target.value)} 
          />
					<input disabled={loading} type="submit" className="bt-green first" value="ALTERAR" />
				</form> 
			</Modal>
    </>
  )
}