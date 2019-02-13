var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var total= {};
    if (query['cmd'] == 'CalcCharge')
    {
      total = serviceCharge(query);
    }
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
 
    res.write(JSON.stringify(total));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function serviceCharge(query)
{
  //error checking
      if(isNaN(query['checkBal']))
        {
          throw Error("Invalid value for checkBal")
        }
      else 
      {
        if (query['checkBal'] == undefined || query['checkBal']<0)
          throw Error("Invalid value for checkBal");
      }
      if(isNaN(query['savingsBal']))
        {
          throw Error("Invalid value for savingsBal")
        }
      else
      {
        if (query['savingsBal'] == undefined || query['savingsBal']<0)
          throw Error("Invalid value for savingsBal");
      }
      if(isNaN(query['checks']))
        {
          throw Error("Invalid value for checks")
        }
      else 
      {
        if (query['checks'] == undefined || query['checks']<0)
          throw Error("Invalid value for checks");
      }
//gathering together the variables
      var result = {};
      var checkBal = query['checkBal'];
      var savingsBal = query['savingsBal'];
      var checks = query['checks'];
      var boolean1 = true;
      var boolean2 = true;
      var boolean3 = true;
      
      //checking balance of checking account
      if (checkBal > 1000)
      {
        boolean1 = true;
      }
      else
      {
        boolean1 = false;
      }
      
      //checking balance of savings account
      if (savingsBal > 1500)
      {
        boolean2 = true;
      }
      else
      {
        boolean2 = false;
      }
      
      //checking for need to apply service charge
      if (boolean1 || boolean2 == true)
      {
        boolean3 = true;
      }
      else
      {
        boolean3 = false;
      }
      
      //charge amount
      if (boolean3 == false)
      {
        var charge = .15;
      }
      else
      {
        charge = 0;
      }
      
      //calculating and printing total
      if (boolean3 == false)
      {
        var result = {'charge' : (charge*checks)};
      }
      else
      {
        var result = {'charge' : charge};
      }
      return result;
}