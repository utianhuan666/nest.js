import { BadRequestException, Controller, Get, Inject, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import * as qrcode from "qrcode";
import * as crypto from "crypto";
import { RedisClientType } from "redis";
import { query } from "express";


interface QrCodeInfo {
  status: "no-scan" | "scan-wait-confirm" | "scan-confirm" | "scan-cancel" | "expired",
  userInfo?: {
    userId: number;
  }
}


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Inject("REDIS_CLIENT")
  private redisClient: RedisClientType;


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("qrcode/generate")
  async generate() {
    const uuid = crypto.randomUUID();
    const dataUrl = await qrcode.toDataURL(`http://192.168.31.99:3000/pages/confirm.html?id=${uuid}`);
    await this.redisClient.set(`qrcode_${uuid}`, JSON.stringify({
        status: "no-scan"
      })
    );
    return {
      qrcode_id: uuid,
      img: dataUrl
    };
  }

  //查询二维码状态
  @Get("qrcode/check")
  async check(@Query("id") id: String) {
    return this.redisClient.get(`qrcode_${id}`);
  }

  @Get("qrcode/scan")
  async scan(@Query("id") id: String) {
    const info = await this.redisClient.get(`qrcode_${id}`);
    console.log(info);
    if (!info) {
      throw new BadRequestException(info);
    }
    await this.redisClient.set(`qrcode_${id}`, JSON.stringify({
        status: "scan-wait-confirm"
      })
    );
    return 'success'
  }

  @Get('qrcode/confirm')
  async confirm(@Query('id') id: string) {
    const info = await this.redisClient.get(`qrcode_${id}`);
    if(!info) {
      throw new BadRequestException('二维码已过期');
    }
    await this.redisClient.set(`qrcode_${id}`, JSON.stringify({
        status: "scan-confirm"
      })
    );
    return 'success';
  }

  @Get('qrcode/cancel')
  async cancel(@Query('id') id: string) {
    const info = await this.redisClient.get(`qrcode_${id}`);
    if(!info) {
      throw new BadRequestException('二维码已过期');
    }
    await this.redisClient.set(`qrcode_${id}`, JSON.stringify({
        status: "scan-cancel"
      })
    );
    return 'success';
  }


}
