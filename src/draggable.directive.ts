import { Directive, ElementRef, Renderer, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[app-draggable]',
  host: {
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
    '(drag)': 'onDrag($event)'
  }
})
export class DraggableDirective implements OnDestroy, OnInit {

  /**
   * A signal that is emitted when drag ends
   */
  @Output() dragEnded = new EventEmitter<ElementRef>();

  private Δx = 0;
  private Δy = 0;

  constructor(
    private el: ElementRef, private renderer: Renderer
  ) {}

  public ngOnInit(): void {
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'true');
  }

  onDragStart(event: MouseEvent) {
    this.Δx = event.x - this.el.nativeElement.offsetLeft;
    this.Δy = event.y - this.el.nativeElement.offsetTop;
  }

  onDrag(event: MouseEvent) {
    const x = event.x;
    const y = event.y;

    if (!x || !y) {
      return;
    }
    this.renderer.setElementStyle(this.el.nativeElement, 'top', (y - this.Δy) + 'px');
    this.renderer.setElementStyle(this.el.nativeElement, 'left', (x - this.Δx) + 'px');
  }

  onDragEnd(event: MouseEvent) {
    this.Δx = 0;
    this.Δy = 0;
    this.dragEnded.emit(this.el);
  }

  public ngOnDestroy(): void {
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'false');
  }

}
