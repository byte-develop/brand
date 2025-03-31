import { Controller, Post, UseGuards, Request, Get, Patch, UsePipes, ValidationPipe, Param, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Patch('change-password/:id')
    @UseGuards(JwtAuthGuard)
    async changePassword(@Param('id') id: number, @Body() body: { oldPassword: string; newPassword: string }) {
        return this.authService.changePassword(id, body.oldPassword, body.newPassword);
    }
}