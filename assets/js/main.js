class App {
  iniSecs() {
    if (document.querySelector('section.sec-button')) {
      require.ensure([], require => {
        require('./sections/Sec-button').default();
      })
    }
  }

  run() {
    this.iniSecs();
  }
}

const app = new App();
app.run();

