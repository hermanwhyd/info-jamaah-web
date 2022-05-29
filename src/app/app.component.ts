import { Component, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { ConfigService } from '../@vex/services/config.service';
import { Settings } from 'luxon';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { NavigationService } from '../@vex/services/navigation.service';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icCalendar from '@iconify/icons-ic/twotone-calendar-today';
import icSettings from '@iconify/icons-ic/twotone-settings';
import { LayoutService } from '../@vex/services/layout.service';
import { ActivatedRoute } from '@angular/router';
import { SplashScreenService } from '../@vex/services/splash-screen.service';
import { StyleService } from '../@vex/services/style.service';
import icAccountCircle from '@iconify/icons-ic/baseline-people-outline';
import icTraining from '@iconify/icons-ic/baseline-model-training';
import icAccountBalance from '@iconify/icons-ic/account-balance';
import icStyle from '@iconify/icons-ic/style';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'INFO JM';

  constructor(
    private configService: ConfigService,
    private styleService: StyleService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private splashScreenService: SplashScreenService,
    private authSvc: AuthService
  ) {
    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, 'is-blink');
    }

    this.navigationService.items = [
      {
        type: 'dropdown',
        label: 'Dashboard',
        icon: icLayers,
        children: [
          {
            type: 'link',
            label: 'Navigasi',
            route: '/dashboard'
          },
          {
            type: 'link',
            label: 'Analisa Diklat',
            route: '/dashboard/analisa-diklat'
          },
          {
            type: 'link',
            label: 'Evaluasi Diklat',
            route: '/dashboard/evaluasi-diklat'
          }
        ]
      },
      {
        type: 'link',
        label: 'Kalender Kegiatan',
        icon: icCalendar,
        route: 'event-calendar'
      },
      {
        type: 'subheading',
        label: 'Pembina',
        hide: !authSvc.hasAccess(['ADMIN']),
        children: [
          {
            type: 'link',
            label: 'Pembina',
            route: '/pembina',
            icon: icAccountCircle,
            hide: !authSvc.hasAccess(['ADMIN'])
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Jamaah',
        hide: !authSvc.hasAccess(['ADMIN']),
        children: [
          {
            type: 'link',
            label: 'Jamaah',
            icon: icTraining,
            hide: !authSvc.hasAccess(['ADMIN']),
            route: '/jamaah'
          },
          {
            type: 'link',
            label: 'Keluarga',
            icon: icTraining,
            hide: !authSvc.hasAccess(['ADMIN']),
            route: '/family'
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Workspace',
        hide: !authSvc.hasAccess(['ADMIN']),
        children: [
          {
            type: 'link',
            label: 'Benda Sabil',
            icon: icAccountBalance,
            hide: !authSvc.hasAccess(['ADMIN']),
            route: '/benda-sabil'
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Settings',
        hide: !authSvc.hasAccess(['ADMIN']),
        children: [
          {
            type: 'link',
            label: 'Users',
            route: '/user',
            icon: icAccountCircle,
            hide: !authSvc.hasAccess(['ADMIN'])
          },
          {
            type: 'link',
            label: 'Setups',
            route: '/setup',
            icon: icSettings,
            hide: !authSvc.hasAccess(['ADMIN'])
          }
        ]
      },
      {
        type: 'subheading',
        label: 'Customize',
        children: [
          {
            type: 'link',
            label: 'Personalize',
            route: () => this.layoutService.openConfigpanel(),
            icon: icStyle
          }
        ]
      }
    ];
  }
}
