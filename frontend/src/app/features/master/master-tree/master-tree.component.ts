import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: 'app-master-tree',
  templateUrl: './master-tree.component.html',
  styleUrls: ['./master-tree.component.css']
})
export class MasterTreeComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(private readonly authService: AuthService) {
    this.authStatusSub = new Subscription();
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
