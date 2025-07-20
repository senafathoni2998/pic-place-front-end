import React, { forwardRef, useRef } from "react";
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import "./Modal.css";
import { CSSTransition } from "react-transition-group";

const ModalOverlay = forwardRef((props, ref) => {
  const content = (
    <React.Fragment>
      <div ref={ref} className={`modal ${props.className}`} style={props.style}>
        <header className={`modal__header ${props.headerClass}`}>
          <h2>{props.header}</h2>
        </header>
        <form
          onSubmit={props.onSubmit ? props.onSubmit : (e) => e.preventDefault()}
          className={`modal__content ${props.contentClass}`}
        >
          <div className={`modal__content ${props.contentClass}`}>
            {props.children}
          </div>
          <footer className={`modal__actions ${props.footerClass}`}>
            {props.footer}
          </footer>
        </form>
      </div>
    </React.Fragment>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal-hook"));
});

const Modal = (props) => {
  const nodeRef = useRef(null);

  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        timeout={200}
        classNames="modal"
        mountOnEnter
        unmountOnExit
        nodeRef={nodeRef}
      >
        <ModalOverlay {...props} ref={nodeRef} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
