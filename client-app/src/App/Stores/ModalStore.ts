import { makeAutoObservable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
  rootStore: RootStore;

  modal: {
    open: boolean;
    body: any;
  } = {
    open: false,
    body: null,
  };

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this, {
      rootStore: false,
    });
  }

  openModal = (content: any) => {
    this.modal.open = true;
    this.modal.body = content;
  };

  closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}