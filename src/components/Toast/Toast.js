import cogoToast from "cogo-toast";

class Toaster {
  success = message => {
    let options = { position: "top-center", heading: "Success" };
    cogoToast.success(message, options);
  };

  error = message => {
    let options = { position: "top-center", heading: "Error" };
    cogoToast.error(message, options);
  };

  info = message => {
    let options = { position: "top-center", heading: "Info" };
    cogoToast.info(message, options);
  };
}

export const toast = new Toaster();
