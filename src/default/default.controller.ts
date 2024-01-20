import { Controller, Get } from "@nestjs/common";
import { Public } from "../decorator/public.decorator";

@Public()
@Controller("")
export class DefaultController {
  @Get()
  defaultGet() {
    return `NestJS server is healthy at ${new Date().toISOString()}`;
  }
}
