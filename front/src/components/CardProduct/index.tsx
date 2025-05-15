/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import planImg from "../../assets/img/mockup/plan.jpg";

interface IProps {
  product: any;
  selectProduct: Function;
}

export function CardProduct({ product, selectProduct }: IProps) {
  return(
    <div className="plan">
      <div className="img-c">
        <img src={product?.image || planImg} />
      </div>
      <div className="price">{product?.name && String(product?.name ).length > 20 ? `${String(product?.name ).substring(0, 20)}...` : product?.name }</div>
      <div className="bets">{
        new Intl.NumberFormat("pt-br", {
          style: 'currency', 
          currency: 'BRL'  
        }).format(Number(product.price))
      }</div>
      <div className="bt-c" onClick={() => selectProduct({...product, detail: true})}>
        <a href="#" className="bt" style={{backgroundImage: 'var(--gradient-1)'}}>DETALHES</a>
      </div>
      <div className="bt-c" style={{marginTop: 5}} onClick={() => selectProduct(product)}>
        <a href="#" className="bt">COMPRAR</a>
      </div>
    </div>
  )
}