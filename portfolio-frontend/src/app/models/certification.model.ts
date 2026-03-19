export interface Certification {
  id:             number;
  title:          string;
  issuer:         string;
  image:          string;
  certificateUrl: string;
  badgeUrl:       string | null;
  type:           'course' | 'simulation' | 'badge' | 'assessment' | 'achievement';
}
