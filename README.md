
# IRPay, Manage Your Pays Easily!

With IRPay you can simply implant pay getaways. This library works standalone and with frameworks like express, etc.

## Installation

Install IRPay with npm

```bash
  npm install irpay
```

Or Yarn:

```bash
  npm install irpay
``` 

PNPM:
```bash
  pnpm add irpay
``` 
## How To Use?
Choose Your Propper Storage & Provider Then Start Your Pays Simply.

### Import 
#### Import library (require)
```javascript
const IRPay = require("irpay").default;
const { IdPayProvider, MemoryStorage } = require("irpay");
const { PayStatus } = require("irpay/lib/storages/Storage");
```
#### Import library (import)
```javascript
import IRPay from 'irpay';
import { IdPayProvider, MemoryStorage } from "irpay";
import { PayStatus } from "irpay/lib/storages/Storage";
```

### Create Instance Of IRPay 
```javascript
const pay = new IRPay(
  MemoryStorage,
  IdPayProvider(
    "6a7f99eb-7c20-4412-a972-6dfb7cd253a4",
    true,
    "http://localhost:3000"
  )
);
```

### Request Pay
```javascript 
 // Send Pay Request To Provider (IdPay Here)
  const request = await pay.Provider.sendPayRequest(5000);

  // Redirect User To Redirect Url | Library Will Handle Rest :)
  const redirect_url = request.redirect_url;
```

### Verify Pay
```javascript 
  // Note: Verify Method Check Already Verified Or Not So You Don't Need To Use CheckStatus For Verify
  const verify = await pay.Provider.verifyPay(request.payId);

  // For Successful Verification
  verify.status === PayStatus.Successful;

  // For Fail Verification
  verify.status === PayStatus.Failed;

  // Fail Verification Message
  verify.message;
```

### Check Pay
```javascript 
   // Pay Id Will Be Back From Pay callback as query string or body
  const checkStatus = await pay.Provider.checkPayStatus(request.payId);

  // Successful Pay | Already Processed And Verified
  // Duplicate In Other Word !
  if (checkStatus.status === PayStatus.Successful) {
  }

  // Pay Failed
  else if (checkStatus.status === PayStatus.Failed) {
  }
  
  // Wating User To Back From Pay
  // Pay Successful Waiting For Verify
  else if (checkStatus.status === PayStatus.Waiting) {
  }
```

### All Together :)
```javascript
const IRPay = require("irpay").default;
const { IdPayProvider, MemoryStorage } = require("irpay");
const { PayStatus } = require("irpay/lib/storages/Storage");

const pay = new IRPay(
  MemoryStorage,
  IdPayProvider(
    "6a7f99eb-7c20-4412-a972-6dfb7cd253a4",
    true,
    "http://localhost:3000"
  )
);

const main = async () => {
  // Send Pay Request To Provider (IdPay Here)
  const request = await pay.Provider.sendPayRequest(5000);

  // Redirect User To Redirect Url | Library Will Handle Rest :)
  const redirect_url = request.redirect_url;

  // Note: Verify Method Check Already Verified Or Not So You Don't Need To Use CheckStatus For Verify
  const verify = await pay.Provider.verifyPay(request.payId);

  // For Successful Verification
  verify.status === PayStatus.Successful;

  // For Fail Verification
  verify.status === PayStatus.Failed;

  // Fail Verification Message
  verify.message;

  // Pay Id Will Be Back From Pay callback as query string or body
  const checkStatus = await pay.Provider.checkPayStatus(request.payId);

  // Successful Pay | Already Processed And Verified
  // Duplicate In Other Word !
  if (checkStatus.status === PayStatus.Successful) {
  }

  // Pay Failed
  else if (checkStatus.status === PayStatus.Failed) {
  }
  
  // Wating User To Back From Pay
  // Pay Successful Waiting For Verify
  else if (checkStatus.status === PayStatus.Waiting) {
  }
};

main();
```


## Todo:

- Redis & Prisma Storages

- Payir & Zibal Providers + More ...


## Contributing

Contributions are always welcome!

`contributing.md` + Development documentation will soon be published.

You can see MemoryStorage & IdPayProvider to get started by the way.

