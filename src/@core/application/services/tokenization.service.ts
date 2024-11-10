import { JwtPayload } from '@/@core/types';

export abstract class TokenizationService {
	abstract decode(token: string): JwtPayload;
	abstract sign(payload: JwtPayload, expiresIn: string): Promise<string>;
	abstract verify(token: string): boolean;
}
