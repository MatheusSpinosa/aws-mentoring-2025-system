/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { ReactNode, useEffect, useRef } from "react";
import closeSVG from "../../assets/img/close.svg";

// import { ModalOverlay, ModalContent, CloseModal } from './styles'

interface ModalProps {
  handler: boolean;
  children: ReactNode;
  onRequestClose?: () => void;
  title?: string;
}

export function Modal({ 
  children, 
  handler, 
  onRequestClose, 
  title,
}: ModalProps) {
  const keyRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    let handleKey = (event: any) => {
      if (null != keyRef.current) {
        if (event.key === 'Escape') {
          if (onRequestClose) {
            onRequestClose()
          }
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey);
    }
  })

  return (
    <>
    <div className="modal" style={{display: handler === true ? "flex" : "none"}}>
			<div className="cnt">
				<img src={closeSVG} className="close" onClick={onRequestClose} />
				<h1 className="title">{title}</h1>
        {children}
				{/* <div className="txt">
					<p>Lorem ipsum dolor sit amet, odio vocent nonumes an eos, decore dictas menandri has in. Imperdiet consequat sea ei, dolorem platonem temporibus quo cu. Ut vidisse numquam mei. Duo et nemore habemus antiopam. Clita facilisi phaedrum quo an, duo an alia purto equidem. Nam et meliore reprehendunt, ex eos oblique numquam invenire, sonet iisque menandri est ad.</p>
					<a href="javascript:void()" className="bt-green first">ENVIAR</a>
					<a href="javascript:void()" className="bt-red">CANCELAR</a>
				</div>
				<form action="javascript:void();" accept-charset="utf-8">
          
					<input type="text" name="field-1" placeholder="SENHA ATUAL" />
					<input type="text" name="field-2" placeholder="NOVA SENHA" />
					<input type="text" name="field-3" placeholder="CONFIRMAÇÃO DA NOVA SENHA" />
					<input type="submit" className="bt-green first" value="ENVIAR" />
					<input type="submit" className="bt-red" value="CANCELAR" />
				</form> */}
			</div>
		</div>
      {/* <ModalOverlay
        className={`${handler ? 'active' : ''}`}
        opacity={overlayOpacity}
        ref={keyRef}
      >
        <ModalContent width={width} noPadding={noPadding}>
          {children}
        </ModalContent>
        {!noClose && (
          <CloseModal onClick={onRequestClose}>
            <FiX />
          </CloseModal>
        )}
      </ModalOverlay> */}
    </>
  )
}