import { environment } from "@/environments/environment";

export class AppSettings {
  public static appName = 'sitegen';
  public static appUrl = window.location.href.substring(0, window.location.href.indexOf('Sitegen')) + AppSettings.appName;
  public static appDisplayName = 'sitegen.io'; // used in title and email
  public static appIcon = 'images/calendar-logo.png';

  public static siteTypesListName = 'SiteTypes';
  public static webTemplatesListName = 'WebTemplates';
  public static reportListName = 'SiteGenLog';

  public static vaubanApplicationPermission = 'https://mesapps.dgtresor.gouv.fr/Vauban/Permissions/Applications';
  public static emailServiceEndpointUrl = '/_vti_bin/dgtEmailService/EmailService.svc/SendEmail';
  public static userServiceEndpointUrl = '/_vti_bin/dgtUsersService/UsersService.svc/GetUsersByTitle';
  public static userIsAdminServiceEndpointUrl = '/_vti_bin/DgtServiceSharePoint/ServiceSharePoint.svc/IsAppAdmin';
  public static userOrganizationServiceEndpointUrl = '/_vti_bin/DgtServiceSharePoint/ServiceSharePoint.svc/GetOrganization';
  public static seqServiceEndpointUrl = '/_vti_bin/DgtSeqService/SeqService.svc/Logger';
  public static devEnvDefaultProxyUrl = 'http://localhost:8080/';
  public static appWebUrlParam = 'SPAppWebUrl';
  public static hostWebUrlParam = 'SPHostUrl';


  public static pnpConfig = environment.production ? {
    sp: {
      headers: {
        Accept: 'application/json;odata=nometadata',
      },
      baseUrl: AppSettings.appUrl
    }
  } :
    {
      sp: {
        headers: {
          Accept: 'application/json; odata=nometadata'
        },
        baseUrl: AppSettings.devEnvDefaultProxyUrl
        // baseUrl: AppSettings.appUrl
      }
  };

  public static env: Environments;
  public static WebEndpointUrl = '/_vti_bin/DgtServiceSharePoint/ServiceSharePoint.svc/IsAlive';
  public static addWebEndpointUrl = '/_vti_bin/DgtServiceSharePoint/ServiceSharePoint.svc/CreateWeb';
  public static getWebTemplatesEndpointUrl = '/_vti_bin/DgtServiceSharePoint/ServiceSharePoint.svc/GetAvailableWebTemplates';
  public static isSiteAdminEndpointUrl = '/_vti_bin/DgtServiceSharePoint/ServiceSharePoint.svc/IsSiteadmin';
  public static isVaubanModEndpointUrl = '/_vti_bin/DgtServiceSharePoint/ServiceSharePoint.svc/IsVaubanModerator';
  public static getUserOrgEndpointUrl = '/_vti_bin/DgtServiceSharePoint/ServiceSharePoint.svc/GetUserOrganization';
  public static getValidUrlEndpointUrl = '/_vti_bin/DgtServiceSharePoint/ServiceSharePoint.svc/GenerateUrl';

}

export enum Environments {
  dev = 'development',
  preprod = 'staging',
  inte = 'integration',
  prod = 'production'
}
