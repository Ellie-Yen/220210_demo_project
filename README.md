# demo project 220210

&#128204; [live demo link (Heroku)](https://ellie-demo-220225.herokuapp.com/)

<img src="demo/interact_chart.gif" alt="demo_interact_with_chart" width="800"/>
(see below for more close looks!)

* description:  
This website provides a *dynamic display* of household data in Taiwan.

* techs:  
  * frontend: React; backend: Express.
  * Use *http-proxy-middleware* in the server for redirecting request to avoid CORS errors.
  (This will throw 503 / H12 error in Heroku since there's a restriction of time to complete a request in free offer; as a result, a static json is used for sending response.)
  * Combining *useRef* and *useEffect* to handle canvas redraw in click / resize events.

* source and liscense:
  * data provider: [台灣政府資料開放平台-戶政司](https://data.gov.tw/dataset/14299).
  * Taipei city logo: [台北市政府民政局](https://ca.gov.taipei/News_Content.aspx?n=A4B94020C5199537&sms=1DDE74CE32104968&s=C17E25726D814E26).
  * http-proxy-middleware: [chimurai](https://github.com/chimurai/http-proxy-middleware/).
  * icon: [Bootstrap](https://getbootstrap.com/).

* close look:
<img src="demo/select_dist.gif" alt="demo_select_dist" width="800"/>
<img src="demo/proxy_in_localhost.png" alt="demo_request_be_redirected" width="800"/>
<img src="demo/failed_to_fetch.png" alt="demo_when_fetch_fails" width="800"/>

<img src="demo/desktop_layout.png" alt="demo_desktop_layout" width="800"/>
<img src="demo/mobile_layout(iPhone SE).png" alt="demo_mobile_layout" width="400"/>
