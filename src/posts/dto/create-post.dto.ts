export class CreatePostDto {
  readonly title: string;
  readonly content: string;
  readonly club: string;
  readonly user?: string; 
}