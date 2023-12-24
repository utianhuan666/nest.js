import { AppService } from "./app.service";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    private redisClient;
    getHello(): string;
    generate(): Promise<{
        qrcode_id: `${string}-${string}-${string}-${string}-${string}`;
        img: string;
    }>;
    check(id: String): Promise<string>;
    scan(id: String): Promise<string>;
    confirm(id: string): Promise<string>;
    cancel(id: string): Promise<string>;
}
