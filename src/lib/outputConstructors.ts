import { default as MSG_MAP } from '../datastore/app_message.json';

/**
 * handle exception errors in [try - catch]
 * @param error any unknown type
 */
export function exception(error: unknown): FailedOutput{
  if (error instanceof Error){
    return failed(`${error.message} ${error.name}`);
  }
  if (error instanceof Response){
    return failed(`${error.status} ${error.statusText}`);
  }
  return failed(MSG_MAP.unknown_fail);
}

/**
 * @param error_msg string represents the reason why error happened
 * @returns FailedOutput
 */
export function failed(error_msg: string): FailedOutput {
  return {
    is_success: false,
    reason: `${MSG_MAP.fail}: ${error_msg}`
  }
}

/**
 * used in success output
 * @param result: any
 */
export function success(result: any): SuccessOutput{
  return {
    is_success: true,
    result
  }
}