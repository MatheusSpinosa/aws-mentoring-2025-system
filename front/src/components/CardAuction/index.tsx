/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { SocketContext } from "../../hooks/contexts/SocketContext";
import { UserContext } from "../../hooks/contexts/UserContext";

interface IProps {
  auction: any;
}

export function CardAuction({auction}: IProps) {
  const { socket, lastConnectionDate } = useContext(SocketContext);
  const { SendNewBet, user } = useContext(UserContext);
  const [ timer, setTimer ] = useState(auction?.timer || 15);
  const [ac, setAc] = useState<any>({})
  const [img, setUImg] = useState('')

  useEffect(() => {
    const newAuction = ac;
    let counterTimeout: NodeJS.Timeout | undefined = undefined;

    if (
      !newAuction?.endDate && 
      !newAuction?.winner
    ) {
      const isBefore = dayjs(new Date()).isBefore(new Date(newAuction?.startDate));

      const betIsBefore = dayjs(new Date(newAuction?.last_bet_createdAt)).isBefore(new Date(newAuction?.startDate));
      if (newAuction?.last_bet_createdAt && !isBefore) {
        counterTimeout = setInterval(async () => {
          let seconds = Number(auction?.timer || 15);
          if (betIsBefore) {
            const d = new Date();
            const ad = new Date(newAuction?.startDate);
            const date = (Number(d.getTime()) / 1000);
            const startDate = (Number(ad.getTime()) / 1000);
            seconds -= date - startDate;
            seconds = (seconds < 0) ? 0 : Number(seconds.toFixed(0))
          }
          else {
            const d = new Date();
            const ad = new Date(newAuction?.last_bet_createdAt);
            const date = (Number(d.getTime()) / 1000);
            const lastBet = (Number(ad.getTime()) / 1000);
            seconds -= date - lastBet;
            seconds = (seconds < 0) ? 0 : Number(seconds.toFixed(0))
          }
          setTimer(seconds)
        }, 1000)
      }
      
    }

    return () => {
      if (counterTimeout) {
        clearInterval(counterTimeout);
      }
    }
  }, [ac])

  useEffect(() => {
    setTimer(auction?.timer)

    setAc(auction)
    setUImg(auction?.image)

    socket.emit("subscribe", auction?.id);
    const auctionListener = socket.on(`_${auction?.id}_`, (message, time) => {
      setAc(message)
    })

    return () => {
      auctionListener.removeListener()
    }
  }, [lastConnectionDate])

  return(
    <div 
      className={
        `prod 
          ${(ac?.winner || ac?.status == "e") ? 'ended': ''}
          ${(timer > 0 && timer < Number(Number(auction?.timer || 0) / 3)) ? 'low': ''}
        `
        }
      >
      <div className="img-c">
        <img src={img} />
      </div>
      <div>
        <h3 className="id">LEILÃO #{ac?.id}</h3>
        <h3 className="name">{ac?.name && String(ac?.name).length > 20 ? `${String(ac?.name).substring(0, 20)}...` : ac?.name}</h3>
        <div className="date">
          Início em<br />
          {
            ac?.startDate &&
            new Intl.DateTimeFormat("pt-br", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit" 
            }).format(new Date(ac?.startDate))
          }
        </div>
        <div className="ac-secs">{(ac?.winner || ac?.status == "e" || timer < 0) ? 0 : timer}</div>
        <div className="ac-price">{
          new Intl.NumberFormat("pt-br", {
            style: 'currency', 
            currency: 'BRL'  
          }).format(ac.total_bets ? (Number(ac.total_bets) / 100) : 0)
        }</div>
      </div>
      <div className="lb"
        style={{color: user?.user?.userName && ac?.last_bet_customer_name == user?.user?.userName ? '#00A814': ''}}
      >
        {ac?.last_bet_customer_name}
      </div>
      <div className="bt-c" style={{cursor: "pointer"}}>
        <a onClick={() => SendNewBet(ac?.id)} className="bt">{(ac?.winner || ac?.status == "e") ? 'ENCERRADO': 'LANCE'}</a>
      </div>
    </div>
  )
}