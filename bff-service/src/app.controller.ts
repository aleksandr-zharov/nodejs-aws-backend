import {
    All,
    CacheInterceptor,
    Controller,
    Get,
    HttpException,
    HttpService,
    HttpStatus,
    Req,
    UseInterceptors
} from '@nestjs/common';
import {catchError, map} from "rxjs/operators";

interface Request {
    url: string,
    method: string,
    params: {},
    body: {},
}

@Controller()
export class AppController {
  constructor(private httpService: HttpService) {}

    @Get('product/products')
    @UseInterceptors(CacheInterceptor)
    cachedProductsProxy(@Req() request: Request) {
        return this.redirect(
            `${process.env.product}/products`,
            request,
        );
    }

    @All()
    proxy(@Req() request: Request) {
        const urlParts = request.url.split('/');
        const serviceName = urlParts[1];
        const apiEndpoint = process.env[serviceName];

        if (!apiEndpoint) {
            throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
        }

        return this.redirect(
            `${apiEndpoint}/${serviceName}`,
            request,
        );
    }

    redirect(url, {method, params, body}) {
        const config: any = {
            url,
            method,
            params,
        };
        if (body && Object.keys(body).length) {
            config.data = body;
        }
        return this.httpService
            .request(config)
            .pipe(
                map((response) => response.data),
                catchError(({ response: { data, status } }) => {
                    throw new HttpException(data, status);
                }),
            );
    }
}
