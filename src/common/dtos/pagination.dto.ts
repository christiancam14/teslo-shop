import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @ApiProperty({
        default: 10,
        description: 'How may rows do you need'
    })
    @IsOptional()
    @IsPositive()
    @Type( () => Number ) // enableImplicitConversions: true
    limit?: number;

    @ApiProperty({
        default: 10,
        description: 'How may rows do you wanna skip'
    })
    @IsOptional()
    @Min(0)
    @Type( () => Number ) // enableImplicitConversions: true
    offset?: number;
    
}