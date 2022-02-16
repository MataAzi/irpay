import express from 'express';
import NodePay from '..';
// Using MemoryStorage (Could Use Prisma | Redis | Or Custom One!)
import MemoryStorage from '../storages/Memory';
// Using IdPay Provider Set Your Own!
import IdPayProvider from '../providers/IDPayProvider';
import bodyParser from 'body-parser';
import { PayStatus } from '../storages/Storage';

// Create Express App
const app = express();

// Use BodyParser
app.use(bodyParser.urlencoded());

// Set Views Directory
app.set('views', __dirname + '/views');

// Ejs View Engine
app.set('view engine', 'ejs');

// Create NodePay Instance With Memory Storage & IdPayProvider
const pay = new NodePay(
  MemoryStorage,
  IdPayProvider('6a7f99eb-7c20-4412-a972-6dfb7cd253a4', true, 'http://localhost:3000/call_back'),
);

// Set Pay To Be Accessable In Whole App
// app.set('pay', pay);
// Get Pay from Request (For Other Routers)
// req.app.get('pay')

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/pay', async (req, res) => {
  const request = await pay.Provider.sendPayRequest(req.body.amount);
  res.redirect(request.redirect_url);
});

app.post('/call_back', async (req, res) => {
  const verify = await pay.Provider.verifyPay(req.body.id);
  if (verify.status === PayStatus.Failed) return res.render('fail', { message: verify.message });
  return res.render('success');
});

app.listen(3000);
