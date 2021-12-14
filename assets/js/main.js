class App {
  iniSecs() {
    if (document.querySelector('section.sec-button')) {
        import('./sections/sec-button')
    }
  }

  run() { this.iniSecs() }
}

const app = new App();
app.run();
