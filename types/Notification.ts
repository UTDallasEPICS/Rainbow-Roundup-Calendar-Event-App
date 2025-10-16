export type Subscription = {
  endpoint: string;
  keys: (
    {
        auth: string,
        p256df: string,
    }
  )
};
export type Notification = {
  endpoint: string;
  bagde: string;
  data: string;
  dir: "auto" | "lte" | "rtl";
  icon: string;
  lang: string;
  requireInteraction: boolean;
  silent: boolean;
  tag: string;
};