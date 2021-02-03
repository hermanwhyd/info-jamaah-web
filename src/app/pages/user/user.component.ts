import { Component, OnInit } from '@angular/core';

import icContacts from '@iconify/icons-ic/twotone-contacts';
import icSearch from '@iconify/icons-ic/twotone-search';
import { scaleIn400ms } from '../../../@vex/animations/scale-in.animation';
import { fadeInRight400ms } from '../../../@vex/animations/fade-in-right.animation';
import { TableColumn } from '../../../@vex/interfaces/table-column.interface';
import { FormControl } from '@angular/forms';
import { debounceTime, finalize } from 'rxjs/operators';
import { stagger40ms } from '../../../@vex/animations/stagger.animation';
import { MatDialog } from '@angular/material/dialog';

import icMenu from '@iconify/icons-ic/twotone-menu';
import icViewHeadline from '@iconify/icons-ic/twotone-view-headline';
import icAdmin from '@iconify/icons-ic/outline-admin-panel-settings';
import icPegawai from '@iconify/icons-ic/baseline-supervised-user-circle';

import { User } from './interfaces/user.interface';
import { UserService } from './service/user.service';
import { UserEditComponent } from './user-edit/user-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotifComponent } from 'src/app/utilities/snackbar-notif/snackbar-notif.component';
import { UserTableMenu } from './interfaces/user-table-menu.inteface';
import { ConfirmationDialogComponent } from 'src/app/utilities/confirmation-dialog/confirmation-dialog.component';

import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { GenericRs } from 'src/app/types/generic-rs.model';

@Component({
  selector: 'vex-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [
    stagger40ms,
    scaleIn400ms,
    fadeInRight400ms
  ]
})
export class UserComponent implements OnInit {
  icSearch = icSearch;
  icContacts = icContacts;
  icMenu = icMenu;

  isLoading = false;

  searchCtrl = new FormControl();
  searchStr$ = this.searchCtrl.valueChanges.pipe(
    debounceTime(10)
  );

  activeCategory: UserTableMenu['id'] = 'all';
  menuOpen = false;

  usersSubject$: BehaviorSubject<User[]> = new BehaviorSubject([]);
  activeActegory$: BehaviorSubject<string> = new BehaviorSubject('all');
  users: User[] = [];

  tableColumns: TableColumn<User>[] = [
    { label: 'IMAGE', property: 'jamaah.photo', type: 'image' },
    { label: 'NAMA', property: 'jamaah.fullName', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'EMAIL', property: 'email', type: 'text', cssClasses: ['text-secondary'] },
    { label: 'HANDPHONE', property: 'mobile', type: 'text', cssClasses: ['text-secondary'] },
    { label: '', property: 'menu', type: 'button', cssClasses: ['text-secondary', 'w-10'] },
  ];

  tableMenu: UserTableMenu[] = [
    { id: 'all', icon: icViewHeadline, label: 'Semua User' },
    { id: 'admin', icon: icAdmin, label: 'User Admin', classes: { icon: 'text-pink' } },
  ];

  constructor(private userService: UserService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchData();

    this.activeActegory$.subscribe(cat => {
      const users = this.usersSubject$.getValue();
      this.users = users.filter(u => {
        return (cat === 'all') ? users : _.includes(u.roles, cat.toUpperCase());
      });
    });
  }

  fetchData() {
    this.isLoading = true;
    this.userService.getUserList('jamaah')
    .pipe(finalize(() => this.isLoading = false))
    .subscribe((rs) => {
      this.usersSubject$.next(rs.data);
      this.refreshData();
    });
  }

  createOrUpdateUser(user?: User) {
    this.dialog.open(UserEditComponent, {
      data: user || {} as User,
      width: '500px',
      disableClose: true
    })
    .afterClosed().subscribe((newUser: User) => {
      if (!newUser) { return; }

      // creation or update existing
      this.userService.saveOrUpdate(newUser)
        .subscribe(rs => {
          const users = this.usersSubject$.getValue();
          // Update or create
          if (user) {
            const index = _.findIndex(users, user);
            users[index] = rs.data;
          } else {
            users.unshift(rs.data);
          }

          this.refreshData();
          this.snackBar.openFromComponent(SnackbarNotifComponent, {data: {message: 'User berhasil disimpan', type: 'success'}});
        }, (err: GenericRs<any>) => {
          this.snackBar.openFromComponent(SnackbarNotifComponent, {data: {message: err.message, type: 'danger'}});
          this.createOrUpdateUser(newUser);
        });
    });
  }

  deleteUser(model: User) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: `Apakah Anda ingin menghapus user <strong>${model.name}</strong>?`,
        buttonText: {
          ok: 'Ya',
          cancel: 'Cancel'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.delete(model.id)
        .subscribe((rs) => {
          if (rs.status === 'ok') {
            const users = this.usersSubject$.getValue();
            _.remove(users, {id: model.id});
            this.refreshData();
          } else {
            this.snackBar.openFromComponent(SnackbarNotifComponent, {data: {message: rs.message, type: 'danger'}});
          }
        });
      }
    });
  }

  applyFilter(category: string) {
    this.activeActegory$.next(category);
  }

  refreshData(): void {
    this.activeActegory$.next(this.activeActegory$.getValue());
  }

  openMenu() {
    this.menuOpen = true;
  }
}
