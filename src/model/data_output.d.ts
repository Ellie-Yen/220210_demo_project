// models for processed data from api
// used in further data processing or component rendering

interface SuccessOutput {
  is_success: true,
  result: any
}
interface FailedOutput {
  is_success: false,
  reason: string
}