import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import * as React from "react";
import { StepButtonContainer } from "./step-button-container";
import { StepIcon } from "./step-icon";
import { StepLabel } from "./step-label";
import type { StepSharedProps } from "./types";
import { useStepper } from "./use-stepper";

type VerticalStepProps = StepSharedProps & {
	children?: React.ReactNode;
};

const verticalStepVariants = cva(
	"flex flex-col relative transition-all duration-200",
	{
		variants: {
			variant: {
				circle: cn(
					"pb-[var(--step-gap)] gap-[var(--step-gap)]",
					"[&:not(:last-child)]:after:content-[''] [&:not(:last-child)]:after:w-[2px] [&:not(:last-child)]:after:bg-border",
					"[&:not(:last-child)]:after:inset-x-[calc(var(--step-icon-size)/2)]",
					"[&:not(:last-child)]:after:absolute",
					"[&:not(:last-child)]:after:top-[calc(var(--step-icon-size)+var(--step-gap))]",
					"[&:not(:last-child)]:after:bottom-[var(--step-gap)]",
					"[&:not(:last-child)]:after:transition-all [&:not(:last-child)]:after:duration-200",
				),
				line: "flex-1 border-t-0 mb-4",
			},
		},
	},
);

const VerticalStep = React.forwardRef<HTMLDivElement, VerticalStepProps>(
	(props, ref) => {
		const {
			children,
			index,
			isCompletedStep,
			isCurrentStep,
			label,
			description,
			icon,
			hasVisited,
			state,
			checkIcon: checkIconProp,
			errorIcon: errorIconProp,
			onClickStep,
		} = props;

		const {
			checkIcon: checkIconContext,
			errorIcon: errorIconContext,
			isError,
			isLoading,
			variant,
			onClickStep: onClickStepGeneral,
			clickable,
			expandVerticalSteps,
			styles,
			scrollTracking,
			orientation,
			steps,
			setStep,
		} = useStepper();

		const opacity = hasVisited ? 1 : 0.8;
		const localIsLoading = isLoading || state === "loading";
		const localIsError = isError || state === "error";

		const active =
			variant === "line" ? isCompletedStep || isCurrentStep : isCompletedStep;
		const checkIcon = checkIconProp || checkIconContext;
		const errorIcon = errorIconProp || errorIconContext;

		const renderChildren = () => {
			if (!expandVerticalSteps) {
				return (
					<Collapsible open={isCurrentStep}>
						<CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
							{children}
						</CollapsibleContent>
					</Collapsible>
				);
			}
			return children;
		};

		return (
			<div
				ref={ref}
				className={cn(
					"stepper__vertical-step",
					verticalStepVariants({
						variant: variant?.includes("circle") ? "circle" : "line",
					}),
					"data-[completed=true]:[&:not(:last-child)]:after:bg-blue-500",
					"data-[invalid=true]:[&:not(:last-child)]:after:bg-destructive",
					styles?.["vertical-step"],
				)}
				data-optional={steps[index || 0]?.optional}
				data-completed={isCompletedStep}
				data-active={active}
				data-clickable={clickable || !!onClickStep}
				data-invalid={localIsError}
				onClick={() =>
					onClickStep?.(index || 0, setStep) ||
					onClickStepGeneral?.(index || 0, setStep)
				}
			>
				<div
					data-vertical={true}
					data-active={active}
					className={cn(
						"stepper__vertical-step-container",
						"flex items-center",
						variant === "line" &&
							"border-s-[3px] data-[active=true]:border-blue-500 py-2 ps-3",
						styles?.["vertical-step-container"],
					)}
				>
					<StepButtonContainer
						{...{ isLoading: localIsLoading, isError: localIsError, ...props }}
					>
						<StepIcon
							{...{
								index,
								isError: localIsError,
								isLoading: localIsLoading,
								isCurrentStep,
								isCompletedStep,
							}}
							icon={icon}
							checkIcon={checkIcon}
							errorIcon={errorIcon}
						/>
					</StepButtonContainer>
					<StepLabel
						label={label}
						description={description}
						{...{ isCurrentStep, opacity }}
					/>
				</div>
				<div
					ref={(node) => {
						if (scrollTracking) {
							node?.scrollIntoView({
								behavior: "smooth",
								block: "center",
							});
						}
					}}
					className={cn(
						"stepper__vertical-step-content",
						"min-h-4",
						variant !== "line" && "ps-[--step-icon-size]",
						variant === "line" && orientation === "vertical" && "min-h-0",
						styles?.["vertical-step-content"],
					)}
				>
					{renderChildren()}
				</div>
			</div>
		);
	},
);

export { VerticalStep };