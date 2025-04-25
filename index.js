let puppeteer = require('puppeteer');
let express = require('express');
import serverless from "serverless-http";

const app = express();
app.get('/',async (req,res) =>{
  res.send("Simple Nesco Web Scrapper API");
});

app.get('/nesco', async (req, res) => {
  
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Navigate the page to a URL
    await page.goto('https://customer.nesco.gov.bd/pre/panel');
  
    
    await page.type('input[name="cust_no"]', '14010250');
  
  
    await Promise.all([
      page.click("#recharge_hist_button"),
      page.waitForNavigation() // Wait for navigation if it reloads the page
    ]);
  
    let data = await page.evaluate(function(){
        return Array.from(document.querySelectorAll(".form-control")).map(function(item){
            return item.value;
        });
    });
  
    await browser.close();

    let json = {
      "account_no": data[0].trim(),
      "customer_name":data[1].trim(),
      "address":data[3].trim(),
      "meter_no":data[8].trim(),
      "meter_install":data[13].trim(),
      "balance":data[15].trim()
    };
    let response = JSON.stringify(json);
  
  res.send(response);
});

app.listen(3000);

