import  crypto  from 'crypto';

export const encryptPassword=(password:string, algorithm = 'sha256'): string =>{
  const hash = crypto.createHash(algorithm);
  hash.update(password);
  return hash.digest('hex');
}