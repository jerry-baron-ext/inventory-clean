// aws/xray.service.ts
import { Injectable } from '@nestjs/common';
import * as AWSXRay from 'aws-xray-sdk-core';

@Injectable()
export class XRayService {
  constructor(awsConfig: { accessKeyId: string; secretAccessKey: string; region: string }) {
    // Obtener las credenciales y la región desde el servicio de configuración
    const accessKeyId = awsConfig.accessKeyId;
    const secretAccessKey = awsConfig.secretAccessKey;
    const region = awsConfig.region;

    if (!accessKeyId || !secretAccessKey || !region) {
      throw new Error('AWS credentials or region not configured');
    }

    // Configurar AWS SDK v3 credentials para X-Ray
    AWSXRay.setContextMissingStrategy('LOG_ERROR');

    // Configurar la dirección del daemon 
    AWSXRay.setDaemonAddress('127.0.0.1:2000');

    // Establecer credenciales en el ambiente de AWS
    process.env.AWS_ACCESS_KEY_ID = accessKeyId;
    process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
    process.env.AWS_REGION = region;
  }

  traceFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      AWSXRay.captureAsyncFunc(name, (subsegment) => {
        fn()
          .then((result) => {
            subsegment.close();
            resolve(result);
          })
          .catch((error) => {
            subsegment.close(error);
            reject(error);
          });
      });
    });
  }
}
