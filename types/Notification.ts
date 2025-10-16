export type Subscription = {
  endpoint: string;
  keys: (
    {
        auth: string,
        p256df: string,
    }
  )
};