casper.options.verbose = true;
casper.options.pageSettings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36";
casper.test.begin('Ensure proper build', 1, function(test){
  debugger;
  casper.start('http://localhost:9102/login', function(){
    this.on('page.error', function(msg, trace){
      this.echo('Error: '+msg, 'ERROR');
    });
    this.on('remote.message', function(msg, trace){
      this.echo('From browser: '+msg);
    });
    casper.waitForSelector('h1', function pass(){
      test.pass('Found h1');
    },
    function fail(){
      test.fail('Could not find h1');
    }, 20000);
  });
  casper.run(function(){
    test.done();
  });
});