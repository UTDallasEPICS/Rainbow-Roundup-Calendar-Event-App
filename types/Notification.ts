export type Subscription = {
  endpoint: string;
  keys: (
    {
        auth: string,
        p256dh: string,
    }
  )
};
export type NotificationBody = {
  title: string;
  data:({
    url: string,
  })
  icon: string;
  badge: string;
  body: string;
}