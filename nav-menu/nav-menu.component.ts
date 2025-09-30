import { Component, ViewChild, ChangeDetectorRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { ConnectionService } from 'ng-connection-service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DataShareServiceService } from 'src/app/data-share-service.service';
import { MatExpansionPanel } from '@angular/material/expansion';

interface ChatMessage {
  text: string;
  user: boolean; // true for user, false for bot
  loading?: boolean; // Added for thinking indicator
}

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  status: any = OnlineStatusType;
  onlineStatusCheck: any = OnlineStatusType;
  isConnected: boolean = true;
  isChatPopupVisible: boolean = false;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChildren(MatExpansionPanel) expansionPanels!: QueryList<MatExpansionPanel>;

  isCollapsed = false;
  isMobile = false;

  loginuser: any;
  a: any;
  isChatOpen = false;
  userInput = '';
  chatMessages: ChatMessage[] = [{ text: 'Hi! How can I help you today?', user: false }];
  isLoadingBotResponse: boolean = false; // New loading state variable

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private Datashare: DataShareServiceService,
    private onlineStatusService: OnlineStatusService,
    private connectionService: ConnectionService,
    private idle: Idle,
    private cd: ChangeDetectorRef
  ) {
    this.idle.setIdle(300);
    this.idle.setTimeout(900);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      this.status = status;
    });

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected.hasInternetAccess;
      this.status = this.isConnected ? this.onlineStatusCheck.ONLINE : this.onlineStatusCheck.OFFLINE;
    });
  }

  isChildRouteActive(childRoutes: string[]): boolean {
    return childRoutes.some(path => this.router.url.includes(path));
  }

  ngOnInit() {
    this.observer.observe(['(max-width: 1200px)']).subscribe((state: BreakpointState) => {
      this.isMobile = state.matches;
      if (this.isMobile) {
        this.isCollapsed = true;
      }
    });

    this.loginuser = this.Datashare.getlogin();
    if (this.loginuser) {
      this.a = this.loginuser.trim().charAt(0).toUpperCase();
    }
  }

  toggleMenu() {
    this.sidenav.toggle();
    this.isCollapsed = !this.sidenav.opened;
  }

  toggleChatPopup() {
    this.isChatOpen = !this.isChatOpen;
  }

  navigateToRVAAuditing() {
    this.router.navigate(['RVAAuditing']);
  }

  async sendMessage(event: Event) {
    event.preventDefault();
    if (!this.userInput.trim()) return;

    // Add user message to chat
    this.chatMessages.push({ text: this.userInput.trim(), user: true });
    const userQuery = this.userInput.trim();
    this.userInput = ''; // Clear input field immediately

    this.isLoadingBotResponse = true; // Set loading state to true

    try {
      const response = await fetch(
        'https://docai-gze9ckcnapbyh8b2.canadacentral-01.azurewebsites.net/trackmedai',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: userQuery }),
        }
      );

      const data = await response.json();
      // Add bot reply to chat
      this.chatMessages.push({
        text: data.reply,
        user: false,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Add error message to chat
      this.chatMessages.push({
        text: 'Error fetching data. Please try again.',
        user: false,
      });
    } finally {
      this.isLoadingBotResponse = false; // Set loading state to false after response or error
    }
  }

  panelClosed(closedPanel: MatExpansionPanel) {
    // No specific action needed here for automatic closing
  }

  panelOpened(openedPanel: MatExpansionPanel) {
    this.expansionPanels.forEach(panel => {
      if (panel !== openedPanel && panel.expanded) {
        panel.close();
      }
    });
  }

  logoutuser() {
    this.idle.stop();
    this.Datashare.sendusername('');
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}