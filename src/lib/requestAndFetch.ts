import {
  exception,
  failed,
  success
} from './outputConstructors';
import { default as MSG_MAP } from '../datastore/message.json';

/**
 * @param url: string, the url of api to request
 * @returns SuccessOutput that result is a json conatins data if success,
 * otherwise a FailedOutput
 */
export default async function requestAndFetch(url: string): Promise<SuccessOutput | FailedOutput>{
  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const myRequest = new Request(url, {
      mode: 'cors',
      method: 'GET',
      headers: headers
    });

    const res = await fetch(myRequest);
    if ( ! res.ok){
      return exception(res);
    }
    const data = await res.json();
    // sometimes http status is fine but get error
    if (! data.success){
      return failed(`${MSG_MAP.fetch_fail}-${MSG_MAP.unknown_fail}`);
    }
    return success(data);
  }
  catch (error){
    console.log(error);
    return exception(error);
  }
}