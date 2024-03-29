<?php

declare(strict_types=1);

namespace App\Ports\Controller;

use App\Application\Gate\Request\OpenRequestCommand;
use App\Domain\Gate\GateRemaining;
use App\Domain\User\User;
use App\Infrastructure\Gate\AstraApiGate;
use Ramsey\Uuid\Uuid;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use SimpleBus\SymfonyBridge\Bus\CommandBus;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * @method User getUser()
 */
final class GateAction extends AbstractController
{
    private CommandBus $commandBus;

    private GateRemaining $remaining;

    public function __construct(CommandBus $commandBus, GateRemaining $remaining)
    {
        $this->commandBus = $commandBus;
        $this->remaining = $remaining;
    }

    /**
     * @Cache(vary={"X-Requested-With"})
     */
    public function __invoke(Request $request): Response
    {
        $user = $this->getUser();
        $gateId = Uuid::fromString($request->query->get('gate_id', AstraApiGate::SOUTH_GATE));

        if ($request->isXmlHttpRequest()) {
            return new JsonResponse([
                'remaining_time' => $this->remaining->getRemainingTime($gateId),
            ]);
        }

        if ($request->isMethod('POST')) {
            $this->commandBus->handle(
                new OpenRequestCommand($user->toId(), $gateId),
            );

            return new JsonResponse();
        }

        return $this->render('gate.html.twig');
    }
}
