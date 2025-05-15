/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import planImg from "../../assets/img/mockup/plan.jpg";

interface IProps {
  plan: any;
  selectPlan: Function;
}

export function CardPlan({ plan, selectPlan }: IProps) {
  return(
    <div className="plan">
      <div className="img-c">
        <img src={planImg} />
      </div>
      <div className="price">{
        new Intl.NumberFormat("pt-br", {
          style: 'currency', 
          currency: 'BRL'  
        }).format(Number(plan.price))
      }</div>
      <div className="bets">{plan.bets} lances</div>
      {/* <div className="bonus">
        {plan.description}
      </div> */}
      <div className="bt-c" onClick={() => selectPlan(plan)}>
        <a href="#" className="bt">COMPRAR</a>
      </div>
    </div>
  )
}