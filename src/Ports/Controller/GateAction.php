<?php

declare(strict_types=1);

namespace App\Ports\Controller;

use App\Application\Gate\Request\OpenRequestCommand;
use App\Domain\User\User;
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

    public function __construct(CommandBus $commandBus)
    {
        $this->commandBus = $commandBus;
    }

    public function __invoke(Request $request): Response
    {
        $user = $this->getUser();

        if ($request->isMethod('POST')) {
            $this->commandBus->handle(
                new OpenRequestCommand($user->toId()),
            );

            return new JsonResponse();
        }

        return $this->render('gate.html.twig');
    }
}
