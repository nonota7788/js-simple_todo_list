(() => {
  /*--------------------------------*/
  /* DATA MODULE */
  /*--------------------------------*/
  const todosController = (() => {
    const a = 1;

    return {
      test: () => {
        console.log(a + 5);
      }
    };
  })();

  /*--------------------------------*/
  /* UI MODULE */
  /*--------------------------------*/
  const UIController = (() => {})();

  /*--------------------------------*/
  /* CONTROLLER MODULE */
  /*--------------------------------*/
  const AppController = ((todosCtrl, UICtrl) => {
    const b = todosCtrl.test();

    return {
      test2: () => {
        console.log(b);
      }
    };
  })(todosController, UIController);

  AppController.test2();
})();
