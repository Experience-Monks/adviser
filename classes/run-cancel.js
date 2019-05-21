class Test {
  run() {
    const promise = new Promise((resolve, reject) => {
      console.log('lala');
      setTimeout(() => {
        console.log('async code');
        resolve();
      }, 6000);
    });

    // return 4;

    return promise;
  }
}

async function execute() {
  let test = new Test();
  await test.run();
  console.log('next');
}

execute();
